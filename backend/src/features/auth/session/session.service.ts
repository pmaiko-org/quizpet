import { randomUUID } from "node:crypto";
import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { JwtService } from "@nestjs/jwt";
import Redis from "ioredis";
import { DataSource, IsNull, MoreThan, Not, Repository } from "typeorm";
import { REDIS_CLIENT } from "../../../common/redis/redis.constants";
import { SuccessResponseDto } from "../../../common/dto/success.response.dto";
import { UserEntity } from "../../users/user.entity";
import {
  ACCESS_TOKEN_TTL_SECONDS,
  REFRESH_REUSE_GRACE_SECONDS,
  REFRESH_TOKEN_TTL_SECONDS,
  SESSION_CACHE_TTL_SECONDS,
} from "../auth.constants";
import { DEVICE_COOKIE } from "../auth.constants";
import {
  getCookie,
  getRequestIp,
  hashToken,
  randomToken,
  safeEqual,
} from "../auth.utils";
import { DeviceEntity } from "./entities/device.entity";
import type { IRefreshTokenPayload } from "../security/jwt-payload.interface";
import type { ISessionTokens } from "./interfaces/session-tokens.interface";
import type { IActiveSession } from "./interfaces/active-session.interface";
import { RefreshTokenEntity } from "./entities/refresh-token.entity";
import {
  SessionEventType,
  SessionHistoryEntity,
} from "./entities/session-history.entity";
import { SessionEntity } from "./entities/session.entity";
import { SessionResponseDto } from "../dto/session.response.dto";
import type { Request } from "express";

type TRotationResult =
  | { status: "rotated"; tokens: ISessionTokens }
  | { status: "conflict" }
  | { status: "reused" };

@Injectable()
export class SessionService {
  private readonly accessSecret: string;
  private readonly refreshSecret: string;
  private readonly tokenPepper: string;

  constructor(
    @InjectRepository(SessionEntity)
    private readonly sessionRepository: Repository<SessionEntity>,
    @InjectRepository(DeviceEntity)
    private readonly deviceRepository: Repository<DeviceEntity>,
    private readonly dataSource: DataSource,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
  ) {
    this.accessSecret = this.configService.getOrThrow("auth.accessSecret");
    this.refreshSecret = this.configService.getOrThrow("auth.refreshSecret");
    this.tokenPepper = this.configService.getOrThrow("auth.tokenPepper");
  }

  async create(
    user: UserEntity,
    request: Request,
    existingDeviceIdentifier?: string | null,
  ): Promise<ISessionTokens> {
    const now = new Date();
    const expiresAt = new Date(
      now.getTime() + REFRESH_TOKEN_TTL_SECONDS * 1000,
    );
    const deviceIdentifier = existingDeviceIdentifier || randomToken();
    const identifierHash = hashToken(deviceIdentifier, this.tokenPepper);
    const userAgent = request.headers["user-agent"]?.slice(0, 1000) ?? null;
    const ipAddress = getRequestIp(request);

    let device = await this.deviceRepository.findOne({
      where: { user: { id: user.id }, identifierHash },
    });

    if (!device) {
      device = await this.deviceRepository.save(
        this.deviceRepository.create({
          user,
          identifierHash,
          userAgent,
          lastSeenAt: now,
        }),
      );
    } else {
      device.userAgent = userAgent;
      device.lastSeenAt = now;
      await this.deviceRepository.save(device);
    }

    const session = Object.assign(
      this.sessionRepository.create({
        user,
        device,
        userAgent,
        ipAddress,
        lastActivityAt: now,
        expiresAt,
        revokedAt: null,
        revokeReason: null,
        currentRefreshTokenHash: "pending",
      }),
      { id: randomUUID() },
    );

    const tokens = this.issueTokens(user.id, session.id, deviceIdentifier);
    session.currentRefreshTokenHash = this.hashRefreshJti(
      this.readRefreshPayload(tokens.refreshToken).jti,
    );

    await this.dataSource.transaction(async manager => {
      await manager.save(session);
      await manager.save(
        manager.create(RefreshTokenEntity, {
          session,
          tokenHash: session.currentRefreshTokenHash,
          expiresAt,
          usedAt: null,
          revokedAt: null,
        }),
      );
      await manager.save(
        manager.create(SessionHistoryEntity, {
          session,
          event: SessionEventType.CREATED,
          ipAddress,
          userAgent,
        }),
      );
    });

    await this.cacheActiveSession(
      session.id,
      user.id,
      SESSION_CACHE_TTL_SECONDS,
    );
    return tokens;
  }

  async rotate(
    refreshToken: string,
    request: Request,
  ): Promise<ISessionTokens> {
    const payload = this.readRefreshPayload(refreshToken);
    const lockKey = `auth:refresh-lock:${payload.sid}`;
    const lockValue = randomUUID();
    const acquired = await this.redis.set(lockKey, lockValue, "EX", 8, "NX");

    if (!acquired) {
      throw new ConflictException("Refresh already in progress");
    }

    try {
      const result = await this.rotateInTransaction(payload, request);

      if (result.status === "conflict") {
        throw new ConflictException("Refresh token was already rotated");
      }

      if (result.status === "reused") {
        await this.cacheRevokedSession(payload.sid);
        throw new UnauthorizedException("Refresh token reuse detected");
      }

      await this.cacheActiveSession(
        payload.sid,
        payload.sub,
        SESSION_CACHE_TTL_SECONDS,
      );
      return result.tokens;
    } finally {
      await this.redis.eval(
        "if redis.call('get', KEYS[1]) == ARGV[1] then return redis.call('del', KEYS[1]) else return 0 end",
        1,
        lockKey,
        lockValue,
      );
    }
  }

  async validateAccessSession(sessionId: string, userId: string) {
    const cacheKey = this.sessionCacheKey(sessionId);
    const cached = await this.redis.get(cacheKey);

    if (cached === `active:${userId}`) {
      await this.recordActivity(sessionId);
      return true;
    }

    if (cached === "revoked") return false;

    const session = await this.sessionRepository.findOne({
      where: {
        id: sessionId,
        user: { id: userId },
        revokedAt: IsNull(),
        expiresAt: MoreThan(new Date()),
      },
    });

    if (!session) {
      await this.cacheRevokedSession(sessionId);
      return false;
    }

    await this.cacheActiveSession(sessionId, userId, SESSION_CACHE_TTL_SECONDS);
    await this.recordActivity(sessionId);
    return true;
  }

  async validateRefreshSession(refreshToken: string) {
    return Boolean(await this.getActiveRefreshSession(refreshToken));
  }

  async getActiveRefreshSession(
    refreshToken: string,
  ): Promise<IActiveSession | null> {
    try {
      const payload = this.readRefreshPayload(refreshToken);
      const session = await this.sessionRepository.findOne({
        where: {
          id: payload.sid,
          user: { id: payload.sub },
          revokedAt: IsNull(),
          expiresAt: MoreThan(new Date()),
        },
      });

      if (
        !session ||
        !safeEqual(
          session.currentRefreshTokenHash,
          this.hashRefreshJti(payload.jti),
        )
      ) {
        return null;
      }

      return { userId: payload.sub, sessionId: payload.sid };
    } catch {
      return null;
    }
  }

  async revokeByRefreshToken(refreshToken: string, request: Request) {
    const payload = this.readRefreshPayload(refreshToken);
    return this.revoke(payload.sub, payload.sid, request, "logout");
  }

  async list(userId: string, currentSessionId: string) {
    const sessions = await this.sessionRepository.find({
      where: {
        user: { id: userId },
        revokedAt: IsNull(),
        expiresAt: MoreThan(new Date()),
      },
      relations: { device: true },
      order: { lastActivityAt: "DESC" },
    });

    return sessions.map(
      session => new SessionResponseDto(session, currentSessionId),
    );
  }

  async revoke(
    userId: string,
    sessionId: string,
    request: Request,
    reason = "revoked",
  ) {
    const session = await this.sessionRepository.findOne({
      where: { id: sessionId, user: { id: userId }, revokedAt: IsNull() },
    });
    if (!session) return new SuccessResponseDto();

    await this.revokeSession(session, request, reason);
    return new SuccessResponseDto();
  }

  async revokeOthers(
    userId: string,
    currentSessionId: string,
    request: Request,
  ) {
    const sessions = await this.sessionRepository.find({
      where: {
        user: { id: userId },
        id: Not(currentSessionId),
        revokedAt: IsNull(),
      },
    });

    await Promise.all(
      sessions.map(session =>
        this.revokeSession(session, request, "otherSessionsRevoked"),
      ),
    );
    return new SuccessResponseDto();
  }

  async revokeAll(userId: string, request: Request, reason = "accountDeleted") {
    const sessions = await this.sessionRepository.find({
      where: { user: { id: userId }, revokedAt: IsNull() },
    });
    await Promise.all(
      sessions.map(session => this.revokeSession(session, request, reason)),
    );
  }

  private async rotateInTransaction(
    payload: IRefreshTokenPayload,
    request: Request,
  ): Promise<TRotationResult> {
    return this.dataSource.transaction(async manager => {
      const lockedSession = await manager.findOne(SessionEntity, {
        where: { id: payload.sid },
        lock: { mode: "pessimistic_write" },
      });

      const session = lockedSession
        ? await manager.findOne(SessionEntity, {
            where: { id: payload.sid },
            relations: { user: true, device: true },
          })
        : null;

      if (
        !session ||
        session.user.id !== payload.sub ||
        session.revokedAt ||
        session.expiresAt <= new Date()
      ) {
        throw new UnauthorizedException("Session is not active");
      }

      const presentedHash = this.hashRefreshJti(payload.jti);
      if (!safeEqual(session.currentRefreshTokenHash, presentedHash)) {
        const previous = await manager.findOne(RefreshTokenEntity, {
          where: { tokenHash: presentedHash, session: { id: session.id } },
        });
        const withinGrace =
          previous?.usedAt &&
          Date.now() - previous.usedAt.getTime() <=
            REFRESH_REUSE_GRACE_SECONDS * 1000;

        if (withinGrace) return { status: "conflict" };

        await this.markRevoked(manager, session, request, "refreshReuse");
        await manager.save(
          manager.create(SessionHistoryEntity, {
            session,
            event: SessionEventType.REUSE_DETECTED,
            ipAddress: getRequestIp(request),
            userAgent: request.headers["user-agent"]?.slice(0, 1000) ?? null,
          }),
        );
        return { status: "reused" };
      }

      const currentToken = await manager.findOneOrFail(RefreshTokenEntity, {
        where: { tokenHash: presentedHash, session: { id: session.id } },
        lock: { mode: "pessimistic_write" },
      });
      currentToken.usedAt = new Date();
      await manager.save(currentToken);

      const tokens = this.issueTokens(
        session.user.id,
        session.id,
        getCookie(request, DEVICE_COOKIE) ?? randomToken(),
      );
      const nextPayload = this.readRefreshPayload(tokens.refreshToken);
      session.currentRefreshTokenHash = this.hashRefreshJti(nextPayload.jti);
      session.lastActivityAt = new Date();
      session.ipAddress = getRequestIp(request);
      await manager.save(session);
      await manager.save(
        manager.create(RefreshTokenEntity, {
          session,
          tokenHash: session.currentRefreshTokenHash,
          expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_SECONDS * 1000),
          usedAt: null,
          revokedAt: null,
        }),
      );
      await manager.save(
        manager.create(SessionHistoryEntity, {
          session,
          event: SessionEventType.REFRESHED,
          ipAddress: session.ipAddress,
          userAgent: request.headers["user-agent"]?.slice(0, 1000) ?? null,
        }),
      );

      return { status: "rotated", tokens };
    });
  }

  private issueTokens(
    userId: string,
    sessionId: string,
    deviceIdentifier: string,
  ): ISessionTokens {
    const refreshJti = randomUUID();
    return {
      accessToken: this.jwtService.sign(
        { sub: userId, sid: sessionId, type: "access" },
        { secret: this.accessSecret, expiresIn: ACCESS_TOKEN_TTL_SECONDS },
      ),
      refreshToken: this.jwtService.sign(
        { sub: userId, sid: sessionId, jti: refreshJti, type: "refresh" },
        { secret: this.refreshSecret, expiresIn: REFRESH_TOKEN_TTL_SECONDS },
      ),
      csrfToken: randomToken(),
      deviceIdentifier,
      sessionId,
    };
  }

  private readRefreshPayload(refreshToken: string) {
    try {
      const payload = this.jwtService.verify<IRefreshTokenPayload>(
        refreshToken,
        {
          secret: this.refreshSecret,
        },
      );
      if (payload.type !== "refresh" || !payload.sid || !payload.jti) {
        throw new Error("Invalid token type");
      }
      return payload;
    } catch {
      throw new UnauthorizedException("Invalid refresh token");
    }
  }

  private hashRefreshJti(jti: string) {
    return hashToken(jti, this.tokenPepper);
  }

  private async revokeSession(
    session: SessionEntity,
    request: Request,
    reason: string,
  ) {
    await this.dataSource.transaction(async manager => {
      await this.markRevoked(manager, session, request, reason);
    });
    await this.cacheRevokedSession(session.id);
  }

  private async markRevoked(
    manager: import("typeorm").EntityManager,
    session: SessionEntity,
    request: Request,
    reason: string,
  ) {
    const now = new Date();
    session.revokedAt = now;
    session.revokeReason = reason;
    await manager.save(session);
    await manager.update(
      RefreshTokenEntity,
      { session: { id: session.id }, revokedAt: IsNull() },
      { revokedAt: now },
    );
    await manager.save(
      manager.create(SessionHistoryEntity, {
        session,
        event:
          reason === "logout"
            ? SessionEventType.LOGGED_OUT
            : SessionEventType.REVOKED,
        ipAddress: getRequestIp(request),
        userAgent: request.headers["user-agent"]?.slice(0, 1000) ?? null,
      }),
    );
  }

  private async recordActivity(sessionId: string) {
    const key = `auth:activity:${sessionId}`;
    if ((await this.redis.set(key, "1", "EX", 60, "NX")) !== "OK") return;

    await this.sessionRepository.update(sessionId, {
      lastActivityAt: new Date(),
    });
  }

  private sessionCacheKey(sessionId: string) {
    return `auth:session:${sessionId}`;
  }

  private async cacheActiveSession(
    sessionId: string,
    userId: string,
    ttlSeconds: number,
  ) {
    await this.redis.set(
      this.sessionCacheKey(sessionId),
      `active:${userId}`,
      "EX",
      ttlSeconds,
    );
  }

  private async cacheRevokedSession(sessionId: string) {
    await this.redis.set(
      this.sessionCacheKey(sessionId),
      "revoked",
      "EX",
      REFRESH_TOKEN_TTL_SECONDS,
    );
  }
}

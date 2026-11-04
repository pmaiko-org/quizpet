import { ConflictException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { hashToken } from "../auth.utils";
import { RefreshTokenEntity } from "./entities/refresh-token.entity";
import { SessionEntity } from "./entities/session.entity";
import { SessionService } from "./session.service";

const ACCESS_SECRET = "access-secret-for-tests";
const REFRESH_SECRET = "refresh-secret-for-tests";
const TOKEN_PEPPER = "token-pepper-for-tests";

type TManagerOverrides = {
  previousToken?: Partial<RefreshTokenEntity> | null;
};

const createHarness = (overrides: TManagerOverrides = {}) => {
  const jwtService = new JwtService();
  const user = { id: "0f296648-9ef1-43ac-a0d7-cc18564662c3" };
  const session = Object.assign(new SessionEntity({}), {
    id: "778895d7-a9cd-43c2-884b-e0f75f937705",
    user,
    device: { id: "2d38d102-41f9-4ad0-83e1-41f01a8619f6" },
    expiresAt: new Date(Date.now() + 60_000),
    revokedAt: null,
    currentRefreshTokenHash: "",
    ipAddress: "127.0.0.1",
    userAgent: "Jest",
    lastActivityAt: new Date(),
  });
  const currentToken = Object.assign(new RefreshTokenEntity({}), {
    session,
    tokenHash: "",
    expiresAt: session.expiresAt,
    usedAt: null,
    revokedAt: null,
  });
  const manager = {
    findOne: jest.fn((entity: unknown) => {
      if (entity === SessionEntity) return Promise.resolve(session);
      return Promise.resolve(overrides.previousToken ?? currentToken);
    }),
    findOneOrFail: jest.fn(() => Promise.resolve(currentToken)),
    create: jest.fn((_entity: unknown, value: unknown) => value),
    save: jest.fn((value: unknown) => Promise.resolve(value)),
    update: jest.fn(() => Promise.resolve({ affected: 1 })),
  };
  const redis = {
    set: jest.fn(() => Promise.resolve("OK")),
    get: jest.fn(() => Promise.resolve(null)),
    eval: jest.fn(() => Promise.resolve(1)),
  };
  const dataSource = {
    transaction: jest.fn(callback => callback(manager)),
  };
  const configService = {
    getOrThrow: jest.fn((key: string) => {
      if (key === "auth.accessSecret") return ACCESS_SECRET;
      if (key === "auth.refreshSecret") return REFRESH_SECRET;
      return TOKEN_PEPPER;
    }),
  };
  const sessionRepository = {
    findOne: jest.fn(() => Promise.resolve(session)),
  };
  const service = new SessionService(
    sessionRepository as never,
    {} as never,
    dataSource as never,
    jwtService,
    configService as never,
    redis as never,
  );

  const signRefresh = (jti: string) =>
    jwtService.sign(
      {
        sub: user.id,
        sid: session.id,
        jti,
        type: "refresh",
      },
      { secret: REFRESH_SECRET, expiresIn: 60 },
    );

  return {
    service,
    session,
    currentToken,
    manager,
    redis,
    sessionRepository,
    signRefresh,
  };
};

describe("SessionService refresh rotation", () => {
  it("resolves the active QuizPet session for an OAuth interaction", async () => {
    const harness = createHarness();
    const jti = "7da9b095-341c-4f61-b67b-891436153892";
    harness.session.currentRefreshTokenHash = hashToken(jti, TOKEN_PEPPER);

    await expect(
      harness.service.getActiveRefreshSession(harness.signRefresh(jti)),
    ).resolves.toEqual({
      userId: harness.session.user.id,
      sessionId: harness.session.id,
    });
  });

  it("rotates the current refresh token exactly once", async () => {
    const harness = createHarness();
    const jti = "7da9b095-341c-4f61-b67b-891436153892";
    harness.session.currentRefreshTokenHash = hashToken(jti, TOKEN_PEPPER);
    harness.currentToken.tokenHash = harness.session.currentRefreshTokenHash;

    const tokens = await harness.service.rotate(harness.signRefresh(jti), {
      headers: { "user-agent": "Jest" },
      socket: {},
      ip: "127.0.0.1",
    } as never);

    expect(tokens.accessToken).toBeTruthy();
    expect(tokens.refreshToken).toBeTruthy();
    expect(harness.currentToken.usedAt).toBeInstanceOf(Date);
    expect(harness.session.currentRefreshTokenHash).not.toBe(
      harness.currentToken.tokenHash,
    );
    expect(harness.manager.findOne).toHaveBeenNthCalledWith(1, SessionEntity, {
      where: { id: harness.session.id },
      lock: { mode: "pessimistic_write" },
    });
    expect(harness.manager.findOne).toHaveBeenNthCalledWith(2, SessionEntity, {
      where: { id: harness.session.id },
      relations: { user: true, device: true },
    });
  });

  it("returns a conflict for a concurrent use inside the grace window", async () => {
    const jti = "590345b1-0709-48cc-a45e-3b08787eb732";
    const harness = createHarness({
      previousToken: {
        tokenHash: hashToken(jti, TOKEN_PEPPER),
        usedAt: new Date(),
      },
    });
    harness.session.currentRefreshTokenHash = hashToken(
      "new-jti",
      TOKEN_PEPPER,
    );

    await expect(
      harness.service.rotate(harness.signRefresh(jti), {
        headers: {},
        socket: {},
        ip: "127.0.0.1",
      } as never),
    ).rejects.toBeInstanceOf(ConflictException);
    expect(harness.session.revokedAt).toBeNull();
  });

  it("revokes the whole session when an old refresh token is reused", async () => {
    const jti = "75fbf602-adbb-40c8-a355-161f2316d285";
    const harness = createHarness({
      previousToken: {
        tokenHash: hashToken(jti, TOKEN_PEPPER),
        usedAt: new Date(Date.now() - 10_000),
      },
    });
    harness.session.currentRefreshTokenHash = hashToken(
      "new-jti",
      TOKEN_PEPPER,
    );

    await expect(
      harness.service.rotate(harness.signRefresh(jti), {
        headers: {},
        socket: {},
        ip: "127.0.0.1",
      } as never),
    ).rejects.toBeInstanceOf(UnauthorizedException);
    expect(harness.session.revokedAt).toBeInstanceOf(Date);
    expect(harness.redis.set).toHaveBeenCalledWith(
      `auth:session:${harness.session.id}`,
      "revoked",
      "EX",
      expect.any(Number),
    );
  });
});

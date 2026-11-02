import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Redis from "ioredis";
import { REDIS_CLIENT } from "../../../common/redis/redis.constants";
import { OAUTH_HANDOFF_TTL_SECONDS } from "../auth.constants";
import { hashToken, randomToken } from "../auth.utils";

@Injectable()
export class OAuthHandoffService {
  private readonly tokenPepper: string;

  constructor(
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
    configService: ConfigService,
  ) {
    this.tokenPepper = configService.getOrThrow("auth.tokenPepper");
  }

  async create(accessToken: string) {
    const code = randomToken();
    await this.redis.set(
      this.codeKey(code),
      accessToken,
      "EX",
      OAUTH_HANDOFF_TTL_SECONDS,
      "NX",
    );
    return code;
  }

  async consume(code: string, ipAddress: string) {
    const attemptsKey = `auth:handoff-limit:${hashToken(ipAddress, this.tokenPepper)}`;
    const attempts = await this.redis.incr(attemptsKey);
    if (attempts === 1) await this.redis.expire(attemptsKey, 60);
    if (attempts > 20) {
      throw new HttpException(
        "Too many handoff attempts",
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    const accessToken = await this.redis.getdel(this.codeKey(code));
    if (!accessToken) {
      throw new UnauthorizedException("Invalid or expired handoff code");
    }

    await this.redis.del(attemptsKey);
    return accessToken;
  }

  private codeKey(code: string) {
    return `auth:handoff:${hashToken(code, this.tokenPepper)}`;
  }
}

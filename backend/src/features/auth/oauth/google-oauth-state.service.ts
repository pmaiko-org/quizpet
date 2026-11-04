import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import Redis from "ioredis";
import { REDIS_CLIENT } from "../../../common/redis/redis.constants";
import { randomToken, safeEqual } from "../auth.utils";

@Injectable()
export class GoogleOAuthStateService {
  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  async create(returnTo?: string | null) {
    const state = randomToken();
    await this.redis.set(
      `auth:oauth-state:${state}`,
      returnTo ?? "null",
      "EX",
      10 * 60,
    );
    return state;
  }

  async consume(queryState: unknown, cookieState: string | null) {
    if (
      typeof queryState !== "string" ||
      !cookieState ||
      !safeEqual(queryState, cookieState)
    ) {
      throw new UnauthorizedException("Invalid OAuth state");
    }

    const consumed = await this.redis.getdel(`auth:oauth-state:${queryState}`);
    if (consumed === null) {
      throw new UnauthorizedException("OAuth state expired");
    }
    return consumed === "null" ? null : consumed;
  }
}

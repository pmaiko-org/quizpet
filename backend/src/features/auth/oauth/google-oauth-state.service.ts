import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import Redis from "ioredis";
import { REDIS_CLIENT } from "../../../common/redis/redis.constants";
import { randomToken, safeEqual } from "../auth.utils";

@Injectable()
export class GoogleOAuthStateService {
  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  async create() {
    const state = randomToken();
    await this.redis.set(`auth:oauth-state:${state}`, "1", "EX", 10 * 60);
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
    if (!consumed) throw new UnauthorizedException("OAuth state expired");
  }
}

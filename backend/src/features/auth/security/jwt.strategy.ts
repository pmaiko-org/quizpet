import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import type { IJwtPayload } from "./jwt-payload.interface";
import { SessionService } from "../session/session.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(
    configService: ConfigService,
    private readonly sessionService: SessionService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>("auth.accessSecret"),
    });
  }

  async validate(payload: IJwtPayload) {
    if (
      payload.type !== "access" ||
      !payload.sid ||
      !(await this.sessionService.validateAccessSession(
        payload.sid,
        payload.sub,
      ))
    ) {
      throw new UnauthorizedException("Session is not active");
    }
    return payload;
  }
}

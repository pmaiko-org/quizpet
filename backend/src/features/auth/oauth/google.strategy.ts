import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import {
  Profile,
  Strategy,
  StrategyOptions,
  VerifyCallback,
} from "passport-google-oauth20";
import { AuthService } from "../auth.service";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
  constructor(
    private readonly authService: AuthService,
    configService: ConfigService,
  ) {
    const appOrigin = configService.getOrThrow<string>("auth.appOrigin");
    const options: StrategyOptions = {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: `${appOrigin}/backend/auth/google/redirect`,
      scope: ["email", "profile"],
    };
    super(options);
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ) {
    done(null, await this.authService.validateGoogleUser(profile));
  }
}

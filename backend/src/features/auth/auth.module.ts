import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RequestModule } from "../../common/request/request.module";
import { StorageModule } from "../storage/storage.module";
import { UserEntity } from "../users/user.entity";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { GoogleOAuthGuard } from "./oauth/google-oauth.guard";
import { GoogleOAuthStateService } from "./oauth/google-oauth-state.service";
import { GoogleStrategy } from "./oauth/google.strategy";
import { OAuthHandoffService } from "./oauth/oauth-handoff.service";
import { CsrfGuard } from "./security/csrf.guard";
import { JwtStrategy } from "./security/jwt.strategy";
import { DeviceEntity } from "./session/entities/device.entity";
import { RefreshTokenEntity } from "./session/entities/refresh-token.entity";
import { SessionHistoryEntity } from "./session/entities/session-history.entity";
import { SessionEntity } from "./session/entities/session.entity";
import { SessionService } from "./session/session.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      DeviceEntity,
      SessionEntity,
      RefreshTokenEntity,
      SessionHistoryEntity,
    ]),
    PassportModule,
    JwtModule.register({}),
    StorageModule,
    RequestModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    SessionService,
    OAuthHandoffService,
    GoogleOAuthStateService,
    GoogleOAuthGuard,
    GoogleStrategy,
    JwtStrategy,
    CsrfGuard,
    { provide: APP_GUARD, useExisting: CsrfGuard },
  ],
  exports: [SessionService],
})
export class AuthModule {}

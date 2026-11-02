import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseFilters,
  UseGuards,
} from "@nestjs/common";
import { ApiExtraModels } from "@nestjs/swagger";
import type { CookieOptions, Request, Response } from "express";
import { SuccessResponseDto } from "../../common/dto/success.response.dto";
import { UserResponseDto } from "../users/dto/user.response.dto";
import {
  CSRF_COOKIE,
  DEVICE_COOKIE,
  OAUTH_STATE_COOKIE,
  REFRESH_TOKEN_COOKIE,
  REFRESH_TOKEN_TTL_SECONDS,
} from "./auth.constants";
import { AuthService } from "./auth.service";
import { getCookie, getRequestIp } from "./auth.utils";
import { AccessTokenResponseDto } from "./dto/access-token.response.dto";
import { AuthStatusResponseDto } from "./dto/auth-status.response.dto";
import { OAuthHandoffDto } from "./dto/oauth-handoff.dto";
import { SessionResponseDto } from "./dto/session.response.dto";
import { GoogleOAuthExceptionFilter } from "./oauth/google-oauth-exception.filter";
import { GoogleOAuthGuard } from "./oauth/google-oauth.guard";
import { GoogleOAuthStateService } from "./oauth/google-oauth-state.service";
import { OAuthHandoffService } from "./oauth/oauth-handoff.service";
import type {
  IAuthenticatedRequest,
  IGoogleAuthRequest,
} from "./interfaces/authenticated-request.interface";
import { JwtAuthGuard } from "./security/jwt-auth.guard";
import type { ISessionTokens } from "./session/interfaces/session-tokens.interface";
import { SessionService } from "./session/session.service";

@ApiExtraModels(
  AccessTokenResponseDto,
  AuthStatusResponseDto,
  OAuthHandoffDto,
  SessionResponseDto,
)
@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly sessionService: SessionService,
    private readonly googleStateService: GoogleOAuthStateService,
    private readonly handoffService: OAuthHandoffService,
  ) {}

  @Get("google")
  async googleStart(@Res() response: Response) {
    const state = await this.googleStateService.create();
    response.cookie(OAUTH_STATE_COOKIE, state, {
      ...this.baseCookieOptions(),
      httpOnly: true,
      maxAge: 10 * 60 * 1000,
      path: "/backend/auth/google",
    });
    return response.redirect(
      `/backend/auth/google/authorize?state=${encodeURIComponent(state)}`,
    );
  }

  @Get("google/authorize")
  @UseGuards(GoogleOAuthGuard)
  googleAuthorize() {}

  @Get("google/redirect")
  @UseGuards(GoogleOAuthGuard)
  @UseFilters(GoogleOAuthExceptionFilter)
  async googleCallback(
    @Req() request: IGoogleAuthRequest,
    @Res() response: Response,
  ) {
    const tokens = await this.sessionService.create(
      request.user,
      request,
      getCookie(request, DEVICE_COOKIE),
    );
    const handoffCode = await this.handoffService
      .create(tokens.accessToken)
      .catch(async error => {
        await this.sessionService.revoke(
          request.user.id,
          tokens.sessionId,
          request,
          "handoffFailed",
        );
        throw error;
      });
    this.setSessionCookies(response, tokens);
    response.clearCookie(OAUTH_STATE_COOKIE, {
      ...this.baseCookieOptions(),
      path: "/backend/auth/google",
    });
    return response.redirect(
      `/login?handoff=${encodeURIComponent(handoffCode)}`,
    );
  }

  @Post("handoff")
  @HttpCode(HttpStatus.OK)
  @Header("Cache-Control", "no-store")
  async handoff(@Body() body: OAuthHandoffDto, @Req() request: Request) {
    const accessToken = await this.handoffService.consume(
      body.code,
      getRequestIp(request),
    );
    return new AccessTokenResponseDto(accessToken);
  }

  @Post("refresh")
  @HttpCode(HttpStatus.OK)
  @Header("Cache-Control", "no-store")
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshToken = getCookie(request, REFRESH_TOKEN_COOKIE);
    if (!refreshToken) {
      this.clearSessionCookies(response);
      throw new UnauthorizedException("Refresh token is missing");
    }

    const tokens = await this.sessionService.rotate(refreshToken, request);
    this.setSessionCookies(response, tokens);
    return new AccessTokenResponseDto(tokens.accessToken);
  }

  @Get("status")
  @Header("Cache-Control", "no-store")
  async status(@Req() request: Request) {
    const refreshToken = getCookie(request, REFRESH_TOKEN_COOKIE);
    const authenticated = refreshToken
      ? await this.sessionService.validateRefreshSession(refreshToken)
      : false;
    return new AuthStatusResponseDto(authenticated);
  }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  async me(@Req() request: IAuthenticatedRequest) {
    return new UserResponseDto(
      await this.authService.getUser(request.user.sub),
    );
  }

  @Post("logout")
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshToken = getCookie(request, REFRESH_TOKEN_COOKIE);
    if (refreshToken) {
      await this.sessionService
        .revokeByRefreshToken(refreshToken, request)
        .catch(() => undefined);
    }
    this.clearSessionCookies(response);
  }

  @Get("sessions")
  @UseGuards(JwtAuthGuard)
  sessions(
    @Req() request: IAuthenticatedRequest,
  ): Promise<SessionResponseDto[]> {
    return this.sessionService.list(request.user.sub, request.user.sid);
  }

  @Delete("sessions/others")
  @UseGuards(JwtAuthGuard)
  revokeOtherSessions(
    @Req() request: IAuthenticatedRequest,
  ): Promise<SuccessResponseDto> {
    return this.sessionService.revokeOthers(
      request.user.sub,
      request.user.sid,
      request,
    );
  }

  @Delete("sessions/:sessionId")
  @UseGuards(JwtAuthGuard)
  async revokeSession(
    @Param("sessionId", new ParseUUIDPipe()) sessionId: string,
    @Req() request: IAuthenticatedRequest,
    @Res({ passthrough: true }) response: Response,
  ): Promise<SuccessResponseDto> {
    const result = await this.sessionService.revoke(
      request.user.sub,
      sessionId,
      request,
    );
    if (sessionId === request.user.sid) this.clearSessionCookies(response);
    return result;
  }

  private setSessionCookies(response: Response, tokens: ISessionTokens) {
    response.clearCookie(REFRESH_TOKEN_COOKIE, {
      ...this.baseCookieOptions(),
      path: "/backend/auth",
    });
    response.cookie(REFRESH_TOKEN_COOKIE, tokens.refreshToken, {
      ...this.baseCookieOptions(),
      httpOnly: true,
      maxAge: REFRESH_TOKEN_TTL_SECONDS * 1000,
      path: "/",
    });
    response.cookie(DEVICE_COOKIE, tokens.deviceIdentifier, {
      ...this.baseCookieOptions(),
      httpOnly: true,
      maxAge: 365 * 24 * 60 * 60 * 1000,
      path: "/backend/auth",
    });
    response.cookie(CSRF_COOKIE, tokens.csrfToken, {
      ...this.baseCookieOptions(),
      httpOnly: false,
      maxAge: REFRESH_TOKEN_TTL_SECONDS * 1000,
      path: "/",
    });
  }

  private clearSessionCookies(response: Response) {
    response.clearCookie(REFRESH_TOKEN_COOKIE, {
      ...this.baseCookieOptions(),
      path: "/",
    });
    response.clearCookie(REFRESH_TOKEN_COOKIE, {
      ...this.baseCookieOptions(),
      path: "/backend/auth",
    });
    response.clearCookie(CSRF_COOKIE, {
      ...this.baseCookieOptions(),
      path: "/",
    });
  }

  private baseCookieOptions(): CookieOptions {
    return { secure: true, sameSite: "lax" };
  }
}

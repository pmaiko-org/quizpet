import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import type { Request } from "express";
import { OAUTH_STATE_COOKIE } from "../auth.constants";
import { getCookie } from "../auth.utils";
import { GoogleOAuthStateService } from "./google-oauth-state.service";

@Injectable()
export class GoogleOAuthGuard extends AuthGuard("google") {
  constructor(private readonly stateService: GoogleOAuthStateService) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    if (request.query.code) {
      const returnTo = await this.stateService.consume(
        request.query.state,
        getCookie(request, OAUTH_STATE_COOKIE),
      );
      Object.assign(request, { oauthReturnTo: returnTo });
    }
    return super.canActivate(context) as Promise<boolean>;
  }

  getAuthenticateOptions(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    return { state: request.query.state };
  }
}

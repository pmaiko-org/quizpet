import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Header,
  Param,
  Post,
  Req,
  Res,
} from "@nestjs/common";
import type { Request, Response } from "express";
import { REFRESH_TOKEN_COOKIE } from "../../auth/auth.constants";
import { getCookie } from "../../auth/auth.utils";
import { SessionService } from "../../auth/session/session.service";
import { OAuthConsentDto } from "../dto/oauth-consent.dto";
import { OAuthProviderService } from "./oauth-provider.service";

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

@Controller("oauth/interaction")
export class OAuthInteractionController {
  constructor(
    private readonly oauthProvider: OAuthProviderService,
    private readonly sessionService: SessionService,
  ) {}

  @Get(":uid")
  @Header("Cache-Control", "no-store")
  async show(
    @Param("uid") uid: string,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    const interaction = await this.oauthProvider.interactionDetails(
      request,
      response,
    );
    this.assertInteraction(uid, interaction.uid);
    const session = await this.getSession(request);

    if (!session) {
      return response.redirect(
        `/login?returnTo=${encodeURIComponent(request.originalUrl)}`,
      );
    }

    if (interaction.prompt.name === "login") {
      return this.oauthProvider.finishLogin(request, response, session.userId);
    }

    if (
      interaction.prompt.name !== "consent" ||
      interaction.session?.accountId !== session.userId
    ) {
      throw new BadRequestException("Invalid OAuth interaction");
    }

    const clientId = String(interaction.params.client_id);
    const clientName = await this.oauthProvider.getClientName(clientId);
    const csrfToken = await this.oauthProvider.createConsentToken(uid);
    response.setHeader(
      "Content-Security-Policy",
      "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; frame-ancestors 'none'; base-uri 'none'",
    );
    response
      .type("html")
      .send(this.renderConsentPage(uid, clientName, csrfToken));
  }

  @Post(":uid")
  @Header("Cache-Control", "no-store")
  async submit(
    @Param("uid") uid: string,
    @Body() body: OAuthConsentDto,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    const interaction = await this.oauthProvider.interactionDetails(
      request,
      response,
    );
    this.assertInteraction(uid, interaction.uid);
    const session = await this.getSession(request);
    if (
      !session ||
      interaction.prompt.name !== "consent" ||
      interaction.session?.accountId !== session.userId ||
      !(await this.oauthProvider.consumeConsentToken(uid, body.csrfToken))
    ) {
      throw new BadRequestException("Invalid OAuth consent request");
    }

    if (body.decision === "deny") {
      return this.oauthProvider.denyConsent(request, response);
    }

    return this.oauthProvider.finishConsent(request, response);
  }

  private async getSession(request: Request) {
    const refreshToken = getCookie(request, REFRESH_TOKEN_COOKIE);
    return refreshToken
      ? this.sessionService.getActiveRefreshSession(refreshToken)
      : null;
  }

  private assertInteraction(uid: string, interactionUid: string) {
    if (uid !== interactionUid) {
      throw new BadRequestException("Invalid OAuth interaction");
    }
  }

  private renderConsentPage(
    uid: string,
    clientName: string,
    csrfToken: string,
  ) {
    const action = `/backend/oauth/interaction/${encodeURIComponent(uid)}`;
    return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Connect QuizPet</title>
  <style>
    :root { color-scheme: light dark; font-family: system-ui, sans-serif; }
    body { min-height: 100vh; margin: 0; display: grid; place-items: center; background: #fff7ed; color: #0f172a; }
    main { width: min(32rem, calc(100% - 2rem)); box-sizing: border-box; padding: 2rem; border-radius: 1.5rem; background: white; box-shadow: 0 1.5rem 5rem rgb(15 23 42 / .14); }
    h1 { margin: 0 0 .75rem; font-size: 1.75rem; }
    p { line-height: 1.6; color: #475569; }
    ul { padding-left: 1.25rem; line-height: 1.7; }
    form { display: flex; gap: .75rem; margin-top: 1.5rem; }
    button { flex: 1; border: 0; border-radius: .9rem; padding: .9rem 1rem; font: inherit; font-weight: 650; cursor: pointer; }
    .allow { background: #0f172a; color: white; }
    .deny { background: #e2e8f0; color: #0f172a; }
    @media (prefers-color-scheme: dark) {
      body { background: #0c111b; color: #f8fafc; }
      main { background: #172033; }
      p { color: #cbd5e1; }
    }
  </style>
</head>
<body>
  <main>
    <h1>Connect ${escapeHtml(clientName)} to QuizPet?</h1>
    <p>This application requests read-only access to your QuizPet sets.</p>
    <ul>
      <li>Search sets that belong to you</li>
      <li>Read a selected set and its cards</li>
      <li>It cannot create, edit, or delete anything</li>
    </ul>
    <form method="post" action="${action}">
      <input type="hidden" name="csrfToken" value="${escapeHtml(csrfToken)}">
      <button class="deny" type="submit" name="decision" value="deny">Cancel</button>
      <button class="allow" type="submit" name="decision" value="allow">Allow access</button>
    </form>
  </main>
</body>
</html>`;
  }
}

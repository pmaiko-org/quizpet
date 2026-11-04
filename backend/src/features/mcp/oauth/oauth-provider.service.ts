import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  createHash,
  createPrivateKey,
  createPublicKey,
  hkdfSync,
} from "node:crypto";
import {
  OAuthError,
  OAuthErrorCode,
  type AuthInfo,
  type OAuthMetadata,
  type OAuthTokenVerifier,
} from "@modelcontextprotocol/server";
import Redis from "ioredis";
import Provider, {
  errors,
  interactionPolicy,
  type AdapterConstructor,
  type Configuration,
  type Interaction,
} from "oidc-provider";
import type { Request, Response } from "express";
import { REDIS_CLIENT } from "../../../common/redis/redis.constants";
import { randomToken, safeEqual } from "../../auth/auth.utils";
import {
  MCP_ACCESS_TOKEN_TTL_SECONDS,
  MCP_AUTHORIZATION_PATH,
  MCP_ENDPOINT_PATH,
  MCP_INTERACTION_PATH,
  MCP_JWKS_PATH,
  MCP_READ_SCOPE,
  MCP_REGISTRATION_PATH,
  MCP_TOKEN_PATH,
} from "../mcp.constants";
import { createRedisOidcAdapter } from "./redis-oidc.adapter";

const createOAuthJwks = (secret: string) => {
  const seed = Buffer.from(
    hkdfSync("sha256", secret, Buffer.alloc(0), "quizpet-oauth-ed25519", 32),
  );
  const privateKey = createPrivateKey({
    key: Buffer.concat([
      Buffer.from("302e020100300506032b657004220420", "hex"),
      seed,
    ]),
    format: "der",
    type: "pkcs8",
  });
  const publicJwk = createPublicKey(privateKey).export({ format: "jwk" });
  const privateJwk = privateKey.export({ format: "jwk" });
  const kid = createHash("sha256")
    .update(publicJwk.x ?? "")
    .digest("base64url")
    .slice(0, 16);
  return {
    keys: [{ ...privateJwk, use: "sig", alg: "EdDSA", kid }],
  };
};

@Injectable()
export class OAuthProviderService implements OAuthTokenVerifier {
  readonly provider: Provider;
  readonly appOrigin: string;
  readonly resourceUrl: URL;
  readonly metadata: OAuthMetadata;

  constructor(
    configService: ConfigService,
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
  ) {
    this.appOrigin = configService.getOrThrow<string>("auth.appOrigin");
    this.resourceUrl = new URL(MCP_ENDPOINT_PATH, this.appOrigin);
    const secureCookies = new URL(this.appOrigin).protocol === "https:";
    const adapter = createRedisOidcAdapter(
      redis,
    ) as unknown as AdapterConstructor;
    const interactionPolicyConfig = interactionPolicy.base();
    interactionPolicyConfig
      .get("login")
      ?.checks.add(
        new interactionPolicy.Check(
          "quizpet_session",
          "QuizPet authentication is required",
          ctx =>
            ctx.oidc.result?.login
              ? interactionPolicy.Check.NO_NEED_TO_PROMPT
              : interactionPolicy.Check.REQUEST_PROMPT,
        ),
        0,
      );
    const tokenPepper = configService.getOrThrow<string>("auth.tokenPepper");
    const configuration: Configuration = {
      adapter,
      jwks: createOAuthJwks(tokenPepper),
      clients: [],
      clientDefaults: { id_token_signed_response_alg: "EdDSA" },
      clientAuthMethods: ["none"],
      responseTypes: ["code"],
      pkce: { required: () => true },
      findAccount: (_ctx, accountId) => ({
        accountId,
        claims: () => ({ sub: accountId }),
      }),
      cookies: {
        keys: [tokenPepper],
        short: { secure: secureCookies, sameSite: "lax" },
        long: { secure: secureCookies, sameSite: "lax" },
      },
      features: {
        devInteractions: { enabled: false },
        registration: { enabled: true, initialAccessToken: false },
        resourceIndicators: {
          enabled: true,
          defaultResource: () => this.resourceUrl.href,
          getResourceServerInfo: (_ctx, resourceIndicator) => {
            if (resourceIndicator !== this.resourceUrl.href) {
              throw new errors.InvalidTarget("Unknown resource");
            }
            return {
              scope: MCP_READ_SCOPE,
              audience: this.resourceUrl.href,
              accessTokenTTL: MCP_ACCESS_TOKEN_TTL_SECONDS,
              accessTokenFormat: "opaque",
            };
          },
          useGrantedResource: () => true,
        },
      },
      interactions: {
        policy: interactionPolicyConfig,
        url: (_ctx, interaction) =>
          `${MCP_INTERACTION_PATH}/${interaction.uid}`,
      },
      routes: {
        authorization: MCP_AUTHORIZATION_PATH,
        token: MCP_TOKEN_PATH,
        registration: MCP_REGISTRATION_PATH,
        jwks: MCP_JWKS_PATH,
      },
      ttl: {
        AccessToken: MCP_ACCESS_TOKEN_TTL_SECONDS,
        AuthorizationCode: 60,
        Grant: 30 * 24 * 60 * 60,
        Interaction: 10 * 60,
        Session: 60 * 60,
      },
    };

    this.provider = new Provider(this.appOrigin, configuration);
    this.provider.proxy = true;
    this.metadata = {
      issuer: this.appOrigin,
      authorization_endpoint: new URL(MCP_AUTHORIZATION_PATH, this.appOrigin)
        .href,
      token_endpoint: new URL(MCP_TOKEN_PATH, this.appOrigin).href,
      registration_endpoint: new URL(MCP_REGISTRATION_PATH, this.appOrigin)
        .href,
      jwks_uri: new URL(MCP_JWKS_PATH, this.appOrigin).href,
      response_types_supported: ["code"],
      grant_types_supported: ["authorization_code"],
      token_endpoint_auth_methods_supported: ["none"],
      code_challenge_methods_supported: ["S256"],
      scopes_supported: [MCP_READ_SCOPE],
    };
  }

  async verifyAccessToken(tokenValue: string): Promise<AuthInfo> {
    const token = await this.provider.AccessToken.find(tokenValue);
    const resources = token?.aud
      ? Array.isArray(token.aud)
        ? token.aud
        : [token.aud]
      : [];
    const expiresAt = token
      ? Math.floor(Date.now() / 1000) + token.remainingTTL
      : undefined;

    if (
      !token ||
      !token.isValid ||
      !token.accountId ||
      !token.clientId ||
      !expiresAt ||
      resources.length !== 1
    ) {
      throw new OAuthError(OAuthErrorCode.InvalidToken, "Invalid access token");
    }

    return {
      token: tokenValue,
      clientId: token.clientId,
      scopes: [...token.scopes],
      expiresAt,
      resource: new URL(resources[0]),
      extra: { userId: token.accountId },
    };
  }

  interactionDetails(
    request: Request,
    response: Response,
  ): Promise<Interaction> {
    return this.provider.interactionDetails(request, response);
  }

  async finishLogin(request: Request, response: Response, accountId: string) {
    await this.provider.interactionFinished(
      request,
      response,
      { login: { accountId, remember: false } },
      { mergeWithLastSubmission: false },
    );
  }

  async finishConsent(request: Request, response: Response) {
    const interaction = await this.interactionDetails(request, response);
    const { details } = interaction.prompt;
    let grant = interaction.grantId
      ? await this.provider.Grant.find(interaction.grantId)
      : undefined;

    grant ??= new this.provider.Grant({
      accountId: interaction.session?.accountId,
      clientId: String(interaction.params.client_id),
    });

    const missingOidcScope = details.missingOIDCScope;
    if (Array.isArray(missingOidcScope)) {
      grant.addOIDCScope(missingOidcScope.join(" "));
    }

    const missingResourceScopes = details.missingResourceScopes;
    if (
      missingResourceScopes &&
      typeof missingResourceScopes === "object" &&
      !Array.isArray(missingResourceScopes)
    ) {
      for (const [resource, scopes] of Object.entries(missingResourceScopes)) {
        if (Array.isArray(scopes)) {
          grant.addResourceScope(resource, scopes.map(String).join(" "));
        }
      }
    }

    await this.provider.interactionFinished(
      request,
      response,
      { consent: { grantId: await grant.save() } },
      { mergeWithLastSubmission: true },
    );
  }

  async denyConsent(request: Request, response: Response) {
    await this.provider.interactionFinished(
      request,
      response,
      { error: "access_denied", error_description: "Access was denied" },
      { mergeWithLastSubmission: false },
    );
  }

  async getClientName(clientId: string) {
    const client = await this.provider.Client.find(clientId);
    return client?.clientName || clientId;
  }

  async createConsentToken(uid: string) {
    const token = randomToken();
    await this.redis.set(this.consentTokenKey(uid), token, "EX", 10 * 60);
    return token;
  }

  async consumeConsentToken(uid: string, token: string) {
    const stored = await this.redis.getdel(this.consentTokenKey(uid));
    return Boolean(stored && safeEqual(stored, token));
  }

  private consentTokenKey(uid: string) {
    return `oauth:consent:${uid}`;
  }
}

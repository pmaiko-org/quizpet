import { Injectable } from "@nestjs/common";
import { Logger } from "@nestjs/common";
import { createMcpHandler, McpServer } from "@modelcontextprotocol/server";
import {
  getOAuthProtectedResourceMetadataUrl,
  mcpAuthMetadataRouter,
  requireBearerAuth,
} from "@modelcontextprotocol/express";
import { toNodeHandler } from "@modelcontextprotocol/node";
import type { Express, Request, Response } from "express";
import * as z from "zod/v4";
import { SetsService } from "../sets/sets.service";
import {
  MCP_AUTHORIZATION_PATH,
  MCP_ENDPOINT_PATH,
  MCP_JWKS_PATH,
  MCP_READ_SCOPE,
  MCP_REGISTRATION_PATH,
  MCP_TOKEN_PATH,
} from "./mcp.constants";
import { OAuthProviderService } from "./oauth/oauth-provider.service";

const searchInputSchema = z.object({
  query: z.string().trim().min(1).max(120).optional(),
  englishLevel: z.enum(["a1", "a2", "b1", "b2", "c1", "c2"]).optional(),
  topic: z.string().trim().min(1).max(80).optional(),
  page: z.number().int().min(1).default(1),
  perPage: z.number().int().min(1).max(50).default(20),
});

const getSetInputSchema = z.object({
  setId: z.uuid(),
});

@Injectable()
export class McpHttpService {
  private readonly logger = new Logger(McpHttpService.name);

  constructor(
    private readonly oauthProvider: OAuthProviderService,
    private readonly setsService: SetsService,
  ) {}

  mount(express: Express) {
    express.use(
      mcpAuthMetadataRouter({
        oauthMetadata: this.oauthProvider.metadata,
        resourceServerUrl: this.oauthProvider.resourceUrl,
      }),
    );

    const providerHandler = this.oauthProvider.provider.callback();
    for (const path of [
      MCP_AUTHORIZATION_PATH,
      MCP_TOKEN_PATH,
      MCP_REGISTRATION_PATH,
      MCP_JWKS_PATH,
    ]) {
      express.all(new RegExp(`^${path}(?:/.*)?$`), (request, response) =>
        providerHandler(request, response),
      );
    }

    const handler = createMcpHandler(context => {
      const userId = context.authInfo?.extra?.userId;
      if (typeof userId !== "string") {
        throw new Error("Authenticated QuizPet user is missing");
      }
      return this.createServer(userId);
    });
    const nodeHandler = toNodeHandler(handler, {
      onerror: error => this.logger.error(error),
    });
    const resourceMetadataUrl = getOAuthProtectedResourceMetadataUrl(
      this.oauthProvider.resourceUrl,
    );
    const auth = requireBearerAuth({
      verifier: this.oauthProvider,
      requiredScopes: [MCP_READ_SCOPE],
      resourceMetadataUrl,
      expectedResource: this.oauthProvider.resourceUrl,
    });

    express.all(
      MCP_ENDPOINT_PATH,
      auth,
      (request: Request, response: Response) =>
        void nodeHandler(request, response),
    );
  }

  private createServer(userId: string) {
    const server = new McpServer({ name: "quizpet", version: "1.0.0" });

    server.registerTool(
      "search_my_sets",
      {
        title: "Search my QuizPet sets",
        description:
          "Search only the authenticated user's QuizPet sets by text, English level, or topic.",
        inputSchema: searchInputSchema,
        annotations: {
          readOnlyHint: true,
          destructiveHint: false,
          idempotentHint: true,
        },
      },
      async input => {
        const result = await this.setsService.searchOwnedSets(userId, {
          search: input.query,
          englishLevel: input.englishLevel,
          topic: input.topic,
          page: input.page,
          perPage: input.perPage,
        });
        const data = {
          sets: result.data.map(set => ({
            id: set.id,
            name: set.name,
            description: set.description,
            topics: set.topics.map(topic => ({
              label: topic.label,
              value: topic.value,
            })),
            englishLevel: set.englishLevel
              ? {
                  label: set.englishLevel.label,
                  value: set.englishLevel.value,
                }
              : null,
            cardsCount: set.cardsCount,
          })),
          pagination: result.meta,
        };

        return {
          content: [{ type: "text", text: JSON.stringify(data) }],
          structuredContent: data,
        };
      },
    );

    server.registerTool(
      "get_my_set",
      {
        title: "Get my QuizPet set",
        description:
          "Read one QuizPet set and its cards only when it belongs to the authenticated user.",
        inputSchema: getSetInputSchema,
        annotations: {
          readOnlyHint: true,
          destructiveHint: false,
          idempotentHint: true,
        },
      },
      async ({ setId }) => {
        const set = await this.setsService.getOwnedSet(userId, setId);
        if (!set) {
          return {
            isError: true,
            content: [
              {
                type: "text",
                text: "The requested set was not found in the authenticated user's account.",
              },
            ],
          };
        }

        const data = {
          id: set.id,
          name: set.name,
          description: set.description,
          topics: set.topics.map(topic => ({
            label: topic.label,
            value: topic.value,
          })),
          englishLevel: set.englishLevel
            ? {
                label: set.englishLevel.label,
                value: set.englishLevel.value,
              }
            : null,
          cards: set.cards.map(card => ({
            id: card.id,
            position: card.position,
            term: card.term,
            termDescription: card.termDescription,
            definition: card.definition,
          })),
        };

        return {
          content: [{ type: "text", text: JSON.stringify(data) }],
          structuredContent: data,
        };
      },
    );

    return server;
  }
}

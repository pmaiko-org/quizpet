import {
  OpenAPIRegistry,
  OpenApiGeneratorV31,
} from "@asteasolutions/zod-to-openapi";
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

import {
  cmsBootstrapRequestSchema,
  cmsBootstrapResponseSchema,
  cmsPageResolveRequestSchema,
  cmsPageResolveResponseSchema,
  cmsRedirectsResponseSchema,
} from "../src/contracts/cms";

const registry = new OpenAPIRegistry();
const bootstrapResponseSchema = cmsBootstrapResponseSchema.meta({
  id: "CmsBootstrapResponse",
});
const pageResolveResponseSchema = cmsPageResolveResponseSchema.meta({
  id: "CmsPageResolveResponse",
});
const redirectsResponseSchema = cmsRedirectsResponseSchema.meta({
  id: "CmsRedirectsResponse",
});

registry.registerPath({
  method: "get",
  path: "/bootstrap",
  request: { query: cmsBootstrapRequestSchema },
  responses: {
    200: {
      description: "CMS bootstrap data",
      content: { "application/json": { schema: bootstrapResponseSchema } },
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/pages/resolve",
  request: { query: cmsPageResolveRequestSchema },
  responses: {
    200: {
      description: "Resolved CMS page",
      content: { "application/json": { schema: pageResolveResponseSchema } },
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/redirects",
  responses: {
    200: {
      description: "CMS redirects",
      content: { "application/json": { schema: redirectsResponseSchema } },
    },
  },
});

const document = new OpenApiGeneratorV31(registry.definitions).generateDocument(
  {
    openapi: "3.1.0",
    info: {
      title: "QuizPet CMS API",
      version: "1.0.0",
    },
  }
);

writeFileSync(
  resolve(__dirname, "../openapi.json"),
  `${JSON.stringify(document, null, 2)}\n`
);

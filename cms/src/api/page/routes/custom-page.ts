import {
  cmsPageResolveRequestSchema,
  cmsPageResolveResponseSchema,
} from "../../../contracts/cms";

export default {
  routes: [
    {
      method: "GET",
      path: "/pages/resolve",
      handler: "page.resolve",
      request: { query: cmsPageResolveRequestSchema.shape },
      response: cmsPageResolveResponseSchema,
      config: { auth: false },
    },
  ],
};

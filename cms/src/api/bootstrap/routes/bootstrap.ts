import {
  cmsBootstrapRequestSchema,
  cmsBootstrapResponseSchema,
} from "../../../contracts/cms";

export default {
  routes: [
    {
      method: "GET",
      path: "/bootstrap",
      handler: "bootstrap.index",
      request: { query: cmsBootstrapRequestSchema.shape },
      response: cmsBootstrapResponseSchema,
      config: { auth: false },
    },
  ],
};

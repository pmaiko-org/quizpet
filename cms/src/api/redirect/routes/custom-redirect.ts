import { cmsRedirectsResponseSchema } from "../../../contracts/cms";

export default {
  routes: [
    {
      method: "GET",
      path: "/redirects",
      handler: "redirect.index",
      response: cmsRedirectsResponseSchema,
      config: { auth: false },
    },
  ],
};

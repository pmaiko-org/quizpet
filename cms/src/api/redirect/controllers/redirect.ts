import type { Context } from "koa";

import { cmsRedirectsResponseSchema } from "../../../contracts/cms";
import { getRedirects } from "../../../utils/cms-content";

export default {
  async index(ctx: Context) {
    ctx.body = cmsRedirectsResponseSchema.parse(await getRedirects(strapi));
  },
};

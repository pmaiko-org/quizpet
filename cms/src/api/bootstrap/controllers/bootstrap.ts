import type { Context } from "koa";

import {
  cmsBootstrapRequestSchema,
  cmsBootstrapResponseSchema,
} from "../../../contracts/cms";
import {
  getBootstrap,
  getLocaleSettings,
  resolveLocale,
} from "../../../utils/cms-content";

export default {
  async index(ctx: Context) {
    const { locale } = cmsBootstrapRequestSchema.parse(ctx.query);
    const settings = await getLocaleSettings(strapi);

    ctx.body = cmsBootstrapResponseSchema.parse(
      await getBootstrap(strapi, resolveLocale(settings, locale)),
    );
  },
};

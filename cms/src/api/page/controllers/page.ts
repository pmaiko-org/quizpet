import type { Context } from "koa";

import {
  cmsPageResolveRequestSchema,
  cmsPageResolveResponseSchema,
} from "../../../contracts/cms";
import {
  getLocaleSettings,
  resolveLocale,
  resolvePage,
} from "../../../utils/cms-content";
import {
  CMS_PREVIEW_TOKEN_HEADER,
  verifyPreviewToken,
} from "../../../utils/cms-preview";

export default {
  async resolve(ctx: Context) {
    const request = cmsPageResolveRequestSchema.parse(ctx.query);
    const settings = await getLocaleSettings(strapi);
    const locale = resolveLocale(settings, request.locale);

    if (request.status === "draft") {
      const token = ctx.request.headers[CMS_PREVIEW_TOKEN_HEADER];

      if (
        typeof token !== "string" ||
        !verifyPreviewToken(
          token,
          { path: request.path, locale },
          process.env.CMS_PREVIEW_SECRET,
        )
      ) {
        return ctx.unauthorized("Invalid preview token");
      }
    }

    ctx.body = cmsPageResolveResponseSchema.parse(
      await resolvePage(strapi, request.path, locale, request.status),
    );
  },
};

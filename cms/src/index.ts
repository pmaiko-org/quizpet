import type { Core } from "@strapi/strapi";

import { seed } from "../scripts/seed";
import { registerContentValidation } from "./utils/cms-validation";

const REQUIRED_ENV = {
  CMS_PREVIEW_URL: "content preview links and frontend revalidation",
  CMS_PREVIEW_SECRET: "signing content preview links",
  NUXT_REVALIDATE_SECRET: "frontend revalidation after publishing",
};

const assertEnv = (strapi: Core.Strapi) => {
  const missing = Object.entries(REQUIRED_ENV)
    .filter(([name]) => !process.env[name])
    .map(([name, purpose]) => `${name} (${purpose})`);

  if (!missing.length) {
    return;
  }

  const message = `Missing environment variables:\n${missing.join("\n")}`;

  if (process.env.NODE_ENV === "production") {
    throw new Error(message);
  }

  strapi.log.warn(`${message}\nThese features are disabled in this session.`);
};

export default {
  register({ strapi }: { strapi: Core.Strapi }) {
    assertEnv(strapi);
    strapi.customFields.register({ name: "icon", type: "string" });
    registerContentValidation(strapi);
  },
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    await seed(strapi);

    let timer: NodeJS.Timeout | undefined;
    const revalidate = () => {
      const previewUrl = process.env.CMS_PREVIEW_URL;
      const revalidateSecret = process.env.NUXT_REVALIDATE_SECRET;
      if (!previewUrl || !revalidateSecret) {
        return;
      }

      if (timer) clearTimeout(timer);
      timer = setTimeout(async () => {
        try {
          const response = await fetch(
            `${previewUrl}/api/_revalidate`,
            {
              method: "POST",
              headers: {
                "x-revalidate-secret": revalidateSecret,
              },
            },
          );

          if (!response.ok) {
            throw new Error(`Revalidation returned ${response.status}`);
          }
        } catch (error) {
          strapi.log.error("CMS content revalidation failed", error);
        }
      }, 250);
    };

    strapi.db.lifecycles.subscribe({
      models: [
        "api::page.page",
        "api::translation.translation",
        "api::redirect.redirect",
        "api::global.global",
        "plugin::upload.file",
      ],
      afterCreate: revalidate,
      afterUpdate: revalidate,
      afterDelete: revalidate,
    });
  },
};

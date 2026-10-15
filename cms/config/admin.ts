import type { Core } from '@strapi/strapi';

import { getLocaleSettings, resolveLocale } from '../src/utils/cms-content';
import { signPreviewPayload } from '../src/utils/cms-preview';

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Admin => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET')!,
    cookie: {
      path: `${env('PUBLIC_URL')}/admin`,
    },
  },
  apiToken: {
    salt: env('API_TOKEN_SALT')!,
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT')!,
    },
  },
  secrets: {
    encryptionKey: env('ENCRYPTION_KEY')!,
  },
  flags: {
    nps: env.bool('FLAG_NPS', true),
    promoteEE: env.bool('FLAG_PROMOTE_EE', true),
    docLinks: env.bool('FLAG_DOC_LINKS', true),
  },
  preview: {
    enabled: true,
    config: {
      allowedOrigins: [env('CMS_PREVIEW_URL')!],
      async handler(uid, { documentId, locale }) {
        if (uid !== 'api::page.page') {
          return null;
        }

        const resolved = resolveLocale(await getLocaleSettings(strapi), locale);
        const page = await strapi.documents('api::page.page').findOne({
          documentId,
          locale: resolved,
          status: 'draft',
          fields: ['path'],
        });

        if (!page || typeof page.path !== 'string') {
          return null;
        }

        const payload = {
          path: page.path,
          locale: resolved,
          status: 'draft' as const,
          expires: Date.now() + 5 * 60 * 1000,
        };
        const token = Buffer.from(
          JSON.stringify({
            ...payload,
            signature: signPreviewPayload(payload, env('CMS_PREVIEW_SECRET')!),
          }),
        ).toString('base64url');
        const query = new URLSearchParams({ token });

        return `${env('CMS_PREVIEW_URL')}/api/preview?${query}`;
      },
    },
  },
});

export default config;

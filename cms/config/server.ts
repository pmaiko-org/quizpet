import type { Core } from '@strapi/strapi';

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Server => ({
  host: env('HOST')!,
  port: env.int('PORT')!,
  url: env('PUBLIC_URL')!,
  proxy: {
    koa: env.bool('IS_PROXIED'),
    ipHeader: 'X-Forwarded-For',
    maxIpsCount: 1,
  },
  app: {
    keys: env.array('APP_KEYS')!,
  },
  webhooks: {
    populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false),
  },
  openapi: {
    'content-api': {
      access: 'disabled',
      cache: {
        enabled: true,
        filePath: '.strapi/openapi/content-api.json',
      },
    },
  },
});

export default config;

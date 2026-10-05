import type { Core } from '@strapi/strapi';

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Database => {
  const client = env('DATABASE_CLIENT');

  if (client !== 'postgres') {
    throw new Error(`Unsupported DATABASE_CLIENT: ${client}. Use "postgres".`);
  }

  return {
    connection: {
      client,
      connection: {
        connectionString: env('DATABASE_URL'),
        host: env('DATABASE_HOST')!,
        port: env.int('DATABASE_PORT')!,
        database: env('DATABASE_NAME')!,
        user: env('DATABASE_USERNAME')!,
        password: env('DATABASE_PASSWORD')!,
        ssl: env.bool('DATABASE_SSL') && {
          key: env('DATABASE_SSL_KEY', undefined),
          cert: env('DATABASE_SSL_CERT', undefined),
          ca: env('DATABASE_SSL_CA', undefined),
          capath: env('DATABASE_SSL_CAPATH', undefined),
          cipher: env('DATABASE_SSL_CIPHER', undefined),
          rejectUnauthorized: env.bool('DATABASE_SSL_REJECT_UNAUTHORIZED'),
        },
        schema: env('DATABASE_SCHEMA')!,
      },
      pool: {
        min: env.int('DATABASE_POOL_MIN')!,
        max: env.int('DATABASE_POOL_MAX')!,
      },
      acquireConnectionTimeout: env.int('DATABASE_CONNECTION_TIMEOUT')!,
    },
  };
};

export default config;

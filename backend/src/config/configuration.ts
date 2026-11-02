const requiredEnv = (name: string) => {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required`);
  return value;
};

const requiredOrigin = (name: string) => {
  const url = new URL(requiredEnv(name));
  if (url.pathname !== "/" || url.search || url.hash) {
    throw new Error(`${name} must contain only scheme and host`);
  }
  return url.origin;
};

const vars = () =>
  ({
    port: process.env.PORT || 3000,
    isProd: process.env.NODE_ENV === "production",

    auth: {
      accessSecret: requiredEnv("JWT_ACCESS_SECRET"),
      refreshSecret: requiredEnv("JWT_REFRESH_SECRET"),
      tokenPepper: requiredEnv("AUTH_TOKEN_PEPPER"),
      appOrigin: requiredOrigin("APP_ORIGIN"),
    },

    redis: {
      url: requiredEnv("REDIS_URL"),
    },

    db: {
      host: String(process.env.DB_HOST),
      port: Number(process.env.DB_PORT),
      username: String(process.env.DB_USER),
      password: String(process.env.DB_PASSWORD),
      database: String(process.env.DB_DATABASE),
      cmsDatabase: String(process.env.CMS_DATABASE_NAME),
    },
  }) as const;

export default vars;

export type TEnvironmentVariables = ReturnType<typeof vars>;

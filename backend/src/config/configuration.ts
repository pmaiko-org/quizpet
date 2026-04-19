const vars = {
  port: process.env.PORT || 3000,
  isProd: process.env.NODE_ENV === "production",

  db: {
    host: String(process.env.DB_HOST),
    port: Number(process.env.DB_PORT),
    username: String(process.env.DB_USER),
    password: String(process.env.DB_PASSWORD),
    database: String(process.env.DB_DATABASE),
  },
} as const;

export default () => vars;

export type EnvironmentVariables = typeof vars;

export default defineNuxtConfig({
  modules: ["@nuxt/ui", "@nuxt/image", "@nuxt/eslint", "@pinia/nuxt"],
  components: [
    {
      path: "~/shell/components",
      pathPrefix: false,
    },
    {
      path: "~/features",
      pattern: "*/{components,widgets}/**/*.vue",
      pathPrefix: false,
    },
    {
      path: "~/core",
      pattern: "*/components/**/*.vue",
      pathPrefix: false,
    },
    {
      path: "~/shared/components",
      pathPrefix: false,
    },
  ],
  imports: {
    presets: [{ from: "vue-i18n", imports: ["useI18n"] }],
    dirs: [
      "~/shell/composables",
      "~/features/*/store/**/*",
      "~/features/*/composables/**/*",
      "~/core/*/store/**/*",
      "~/core/*/composables/**/*",
      "~/shared/store",
      "~/shared/composables",
      "~/shared/utils",
    ],
  },
  devtools: { enabled: true },

  app: {
    head: {
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
        { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
      ],
      meta: [
        { property: "og:type", content: "website" },
        { property: "og:image", content: "/og-image.png" },
        { property: "og:image:width", content: "1200" },
        { property: "og:image:height", content: "630" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: "/og-image.png" },
      ],
    },
  },
  css: ["~/assets/css/main.css"],

  runtimeConfig: {
    backendApiInternalUrl: process.env.NUXT_BACKEND_API_INTERNAL_URL,
    cmsInternalUrl: process.env.NUXT_CMS_INTERNAL_URL,
    revalidateSecret: process.env.NUXT_REVALIDATE_SECRET,
    redisUrl: process.env.NUXT_REDIS_URL,
    public: {
      backendApiUrl: process.env.NUXT_PUBLIC_BACKEND_API_URL,
      cmsApiUrl: process.env.NUXT_PUBLIC_CMS_API_URL,
      clarityProjectId: "ysw9udr76z",
    },
  },
  routeRules: {
    "/**": {
      headers: {
        "content-security-policy": "frame-ancestors 'self'",
      },
    },
  },
  features: {
    inlineStyles: true,
  },
  compatibilityDate: "2025-07-15",
  eslint: {
    config: {
      stylistic: {
        indent: 2,
        semi: true,
        quotes: "double",
        commaDangle: "always-multiline",
        braceStyle: "1tbs",
      },
    },
  },
  image: {
    provider: "none",
  },
});

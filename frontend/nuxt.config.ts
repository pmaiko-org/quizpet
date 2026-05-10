// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxt/ui", "@nuxt/image", "@nuxt/eslint"],
  pages: {
    pattern: ["**/*.vue", "!**/components/**"],
  },
  components: [
    "~/components",
    {
      path: "~/pages",
      pattern: "**/components/**",
      pathPrefix: false,
    },
    {
      path: "~/features",
      pattern: "*/components/**/*.vue",
      pathPrefix: false,
    },
  ],
  imports: {
    dirs: [
      "~/store",
      "~/features/*/store/**/*",
      "~/features/*/composables/**/*",
    ],
  },
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],

  runtimeConfig: {
    public: {
      apiUrl: "/backend",
    },
  },
  routeRules: {
    "/**": {
      headers: {
        "Cache-Control": "no-cache, no-store, max-age=0, must-revalidate",
        "Pragma": "no-cache",
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

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxt/ui", "@nuxt/image", "@nuxt/eslint"],
  css: ["~/assets/css/main.css"],
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
  ],
  imports: {
    dirs: ["~/store"],
  },
  routeRules: {
    "/**": {
      headers: {
        "Cache-Control": "no-cache",
      },
    },
  },
  features: {
    inlineStyles: true,
  },
});

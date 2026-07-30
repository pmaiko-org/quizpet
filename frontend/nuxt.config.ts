export default defineNuxtConfig({
  modules: [
    "@nuxt/ui",
    "@nuxt/image",
    "@nuxt/eslint",
    "@vueuse/nuxt",
    "@pinia/nuxt",
  ],
  components: [
    {
      path: "~/components",
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
  ],
  imports: {
    dirs: [
      "~/store",
      "~/core/*/store/**/*",
      "~/core/*/composables/**/*",
      "~/features/*/store/**/*",
      "~/features/*/composables/**/*",
    ],
  },
  devtools: { enabled: true },

  app: {
    head: {
      htmlAttrs: { lang: "uk" },
      title: "QuizPet",
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
        { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
      ],
      meta: [
        {
          name: "description",
          content:
            "QuizPet — навчання флеш-картками: створюй набори карток і вчись легко та ефективно.",
        },
        { property: "og:type", content: "website" },
        { property: "og:site_name", content: "QuizPet" },
        { property: "og:title", content: "QuizPet — навчання картками" },
        {
          property: "og:description",
          content: "Створюй набори флеш-карток і вчись легко та ефективно.",
        },
        { property: "og:image", content: "/og-image.png" },
        { property: "og:image:width", content: "1200" },
        { property: "og:image:height", content: "630" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: "QuizPet — навчання картками" },
        {
          name: "twitter:description",
          content: "Створюй набори флеш-карток і вчись легко та ефективно.",
        },
        { name: "twitter:image", content: "/og-image.png" },
      ],
    },
  },
  css: ["~/assets/css/main.css"],

  runtimeConfig: {
    public: {
      apiUrl: "/backend",
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

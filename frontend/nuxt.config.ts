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
    apiInternalUrl: process.env.NUXT_API_INTERNAL_URL,
    cmsInternalUrl: process.env.NUXT_CMS_INTERNAL_URL,
    public: {
      apiUrl: process.env.NUXT_PUBLIC_API_URL,
      cmsUrl: process.env.NUXT_PUBLIC_CMS_URL,
      clarityProjectId: "ysw9udr76z",
    },
  },
  features: {
    inlineStyles: true,
  },
  experimental: {
    typedPages: true,
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

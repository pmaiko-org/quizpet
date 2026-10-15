import { createI18n } from "vue-i18n";

const missingKeys = new Set<string>();

export default defineNuxtPlugin({
  name: "i18n",
  dependsOn: ["api"],
  async setup(nuxtApp) {
    const bootstrap = await useCmsBootstrap().load();

    if (!bootstrap) {
      throw createError({
        statusCode: 503,
        statusMessage: "CMS content is unavailable",
        fatal: true,
      });
    }

    nuxtApp.vueApp.use(
      createI18n({
        legacy: false,
        globalInjection: true,
        locale: bootstrap.locale,
        fallbackLocale: bootstrap.locale,
        messages: { [bootstrap.locale]: bootstrap.translations },
        missingWarn: false,
        fallbackWarn: false,
        missing: (_locale: string, key: string) => {
          if (!missingKeys.has(key)) {
            missingKeys.add(key);
            console.error(`Missing CMS translation: ${key}`);
          }

          return import.meta.dev ? `[NO_TRANSLATION: ${key}]` : key;
        },
      }),
    );
  },
});

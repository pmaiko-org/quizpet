import {
  closeCmsCache,
  getCmsBootstrap,
  getCmsLocales,
  getCmsRedirects,
} from "../utils/cms-cache";

export default defineNitroPlugin(async (nitroApp) => {
  const config = useRuntimeConfig();

  nitroApp.hooks.hook("close", closeCmsCache);

  try {
    const locales = await getCmsLocales(config);

    await Promise.all([
      ...locales.map(locale => getCmsBootstrap(config, locale.code)),
      getCmsRedirects(config),
    ]);
  } catch (error) {
    console.error("CMS warmup failed, content will be loaded on demand", error);
  }
});

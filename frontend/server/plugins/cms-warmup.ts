import {
  getCmsBootstrap,
  getCmsLocales,
  getCmsRedirects,
} from "../utils/cms-cache";

export default defineNitroPlugin(async () => {
  const config = useRuntimeConfig();

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

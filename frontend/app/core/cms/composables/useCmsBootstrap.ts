import type { TCmsBootstrapResponse, TCmsLocale } from "../types";

export const useCmsBootstrap = () => {
  const nuxtApp = useNuxtApp();
  const requestUrl = useRequestURL();

  const asyncData = useAsyncData(
    "cms:bootstrap",
    () =>
      nuxtApp.$repository.cms.getBootstrap<TCmsBootstrapResponse>(
        requestUrl.pathname,
      ),
    { immediate: false, dedupe: "defer" },
  );

  const bootstrap = asyncData.data;
  const locales = computed(() => bootstrap.value?.locales ?? []);
  const cmsLocale = computed(() => bootstrap.value?.locale ?? "");

  const prefixOf = (code: TCmsLocale) => {
    const locale = locales.value.find(item => item.code === code);
    return !locale || locale.isDefault ? "" : `/${locale.code}`;
  };

  const localizePath = (path: string, code = cmsLocale.value) =>
    `${prefixOf(code)}${path === "/" ? "" : path}` || "/";

  const load = async () => {
    if (asyncData.status.value !== "success") {
      await asyncData.execute();
    }

    return bootstrap.value ?? null;
  };

  return {
    bootstrap,
    locales,
    cmsLocale,
    localizePath,
    status: asyncData.status,
    error: asyncData.error,
    load,
  };
};

export const useCmsPageSeo = () => {
  const requestUrl = useRequestURL();
  const cmsBootstrap = useCmsBootstrap();
  const cmsPage = useCmsPage();

  const alternates = computed(() =>
    Object.entries(cmsPage.page.value?.alternates ?? {}).map(
      ([hreflang, path]) => ({
        hreflang,
        href: `${requestUrl.origin}${path}`,
      }),
    ),
  );
  const alternateOf = (code: string) =>
    alternates.value.find(item => item.hreflang === code)?.href;

  const defaultSeo = computed(
    () => cmsBootstrap.bootstrap.value?.global.defaultSeo,
  );
  const pageSeo = computed(() => cmsPage.page.value?.seo);
  const canonical = computed(
    () =>
      pageSeo.value?.canonicalUrl ??
      defaultSeo.value?.canonicalUrl ??
      alternateOf(cmsBootstrap.cmsLocale.value),
  );
  const ogImage = computed(() => {
    const url = pageSeo.value?.ogImage?.url ?? defaultSeo.value?.ogImage?.url;
    return url ? new URL(url, requestUrl.origin).toString() : undefined;
  });
  const title = computed(
    () => pageSeo.value?.metaTitle || defaultSeo.value?.metaTitle || undefined,
  );
  const description = computed(
    () =>
      pageSeo.value?.metaDescription ||
      defaultSeo.value?.metaDescription ||
      undefined,
  );

  useSeoMeta({
    title,
    description,
    ogTitle: title,
    ogDescription: description,
    ogSiteName: () => cmsBootstrap.bootstrap.value?.global.siteName,
    ogImage,
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: ogImage,
    robots: () =>
      pageSeo.value?.noIndex ? "noindex, nofollow" : "index, follow",
  });

  const defaultAlternate = computed(() =>
    alternateOf(
      cmsBootstrap.locales.value.find(locale => locale.isDefault)?.code ??
      cmsBootstrap.cmsLocale.value,
    ),
  );

  useHead(() => ({
    htmlAttrs: { lang: cmsBootstrap.cmsLocale.value },
    link: [
      ...(cmsBootstrap.bootstrap.value?.global.favicon?.url
        ? [
            {
              rel: "icon",
              href: cmsBootstrap.bootstrap.value.global.favicon.url,
            },
          ]
        : []),
      ...(canonical.value ? [{ rel: "canonical", href: canonical.value }] : []),
      ...alternates.value.map(item => ({ rel: "alternate", ...item })),
      ...(defaultAlternate.value
        ? [
            {
              rel: "alternate",
              hreflang: "x-default",
              href: defaultAlternate.value,
            },
          ]
        : []),
    ],
  }));
};

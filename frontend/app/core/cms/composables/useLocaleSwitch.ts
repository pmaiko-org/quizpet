export const useLocaleSwitch = () => {
  const cmsBootstrap = useCmsBootstrap();
  const cmsPage = useCmsPage();

  const options = computed(() =>
    cmsBootstrap.locales.value.map(locale => ({
      code: locale.code,
      name: locale.name,
      isCurrent: locale.code === cmsBootstrap.cmsLocale.value,
      path:
        cmsPage.page.value?.alternates[locale.code] ??
        cmsBootstrap.localizePath("/", locale.code),
    })),
  );

  const switchLocale = (code: string) => {
    const target = options.value.find(option => option.code === code);
    return target ? navigateTo(target.path, { external: true }) : undefined;
  };

  return { options, switchLocale };
};

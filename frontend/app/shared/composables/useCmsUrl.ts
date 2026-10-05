export const useCmsUrl = () => {
  const config = useRuntimeConfig();

  return import.meta.server ? config.cmsInternalUrl : config.public.cmsUrl;
};

export const useCmsApiUrl = () => {
  const config = useRuntimeConfig();

  return config.public.cmsApiUrl;
};

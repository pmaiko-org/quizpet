export const useApiUrl = () => {
  const config = useRuntimeConfig();

  return import.meta.server ? config.apiInternalUrl : config.public.apiUrl;
};

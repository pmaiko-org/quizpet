export const useBackendApiUrl = () => {
  const config = useRuntimeConfig();

  return import.meta.server
    ? config.backendApiInternalUrl
    : config.public.backendApiUrl;
};

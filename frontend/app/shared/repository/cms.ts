import type { TApiFetch, TRequestOptions } from "~/shared/repository/types";

export const cmsRepository = (cmsApi: TApiFetch) => {
  return {
    getBootstrap: <TResponse>(path: string, options?: TRequestOptions) => {
      return cmsApi<TResponse>("/bootstrap", {
        query: { path },
        ...options,
      });
    },

    getPage: <TResponse>(path: string, options?: TRequestOptions) => {
      return cmsApi<TResponse>("/pages/resolve", {
        query: { path },
        ...options,
      });
    },

    getRedirects: <TResponse>(options?: TRequestOptions) => {
      return cmsApi<TResponse>("/redirects", { ...options });
    },
  };
};

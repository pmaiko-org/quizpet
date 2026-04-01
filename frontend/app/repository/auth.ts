import type { $Fetch, NitroFetchRequest } from "nitropack";

export const authRepository = <T>(fetch: $Fetch<T, NitroFetchRequest>) => {
  return {
    refreshToken: () => {
      return fetch('/backend/auth/refresh')
    },
    logout: () => {},
  };
};

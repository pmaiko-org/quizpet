import type { $Fetch, NitroFetchRequest } from "nitropack";
import type { IUserResponse } from "~/types/api.generated";

export type { IUserResponse };

export const profileRepository = <T>(fetch: $Fetch<T, NitroFetchRequest>) => {
  return {
    getProfile: () => {
      return fetch<IUserResponse>("/backend/users/me");
    },
  };
};

import type { $Fetch, NitroFetchRequest } from "nitropack";

import type { TRequestOptions } from "~/repository/types";
import type { IProfileUpdate, IUserResponse } from "~/types/api.generated";

export const profileRepository = <T>(fetch: $Fetch<T, NitroFetchRequest>) => {
  return {
    getProfile: (options?: TRequestOptions) => {
      return fetch<IUserResponse>("/backend/users/me", { ...options });
    },

    updateProfile: (body: IProfileUpdate, options?: TRequestOptions) => {
      return fetch<IUserResponse>("/backend/users/me", {
        method: "PATCH",
        body,
        ...options,
      });
    },
  };
};

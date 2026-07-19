import type { $Fetch, NitroFetchRequest } from "nitropack";
import type { IUpdateProfile, IUserResponse } from "~/types/api.generated";

export const profileRepository = <T>(fetch: $Fetch<T, NitroFetchRequest>) => {
  return {
    getProfile: () => {
      return fetch<IUserResponse>("/backend/users/me");
    },

    updateProfile: (body: IUpdateProfile) => {
      return fetch<IUserResponse>("/backend/users/me", {
        method: "PATCH",
        body,
      });
    },
  };
};

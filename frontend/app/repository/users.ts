import type { $Fetch, NitroFetchRequest } from "nitropack";

import type { TRequestOptions } from "~/repository/types";
import type {
  IProfileStatsResponse,
  IUserListQuery,
  IUserListResponse,
} from "~/types/api.generated";

export const usersRepository = <T>(fetch: $Fetch<T, NitroFetchRequest>) => {
  return {
    getUsers: (query?: Partial<IUserListQuery>, options?: TRequestOptions) => {
      return fetch<IUserListResponse>("/backend/users", {
        method: "GET",
        query,
        ...options,
      });
    },

    getMyStats: (options?: TRequestOptions) => {
      return fetch<IProfileStatsResponse>("/backend/users/me/stats", {
        method: "GET",
        ...options,
      });
    },
  };
};

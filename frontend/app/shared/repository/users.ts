import type { $Fetch, NitroFetchRequest } from "nitropack";

import type { TRequestOptions } from "~/shared/repository/types";
import type {
  IProfileStatsResponse,
  IUserListQuery,
  IUserListResponse,
} from "~/shared/types/api.generated";

export const usersRepository = <T>(fetch: $Fetch<T, NitroFetchRequest>) => {
  return {
    getUsers: (query?: Partial<IUserListQuery>, options?: TRequestOptions) => {
      return fetch<IUserListResponse>("/users", {
        method: "GET",
        query,
        ...options,
      });
    },

    getMyStats: (options?: TRequestOptions) => {
      return fetch<IProfileStatsResponse>("/users/me/stats", {
        method: "GET",
        ...options,
      });
    },
  };
};

import type { $Fetch, NitroFetchRequest } from "nitropack";
import type { IUserListQuery, IUserListResponse } from "~/types/api.generated";

export const usersRepository = <T>(fetch: $Fetch<T, NitroFetchRequest>) => {
  return {
    getUsers: (query?: Partial<IUserListQuery>) => {
      return fetch<IUserListResponse>("/backend/users", {
        method: "GET",
        query,
      });
    },
  };
};

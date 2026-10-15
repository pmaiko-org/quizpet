import type { TApiFetch, TRequestOptions } from "~/shared/repository/types";
import type {
  IProfileStatsResponse,
  IUserListQuery,
  IUserListResponse,
} from "~/shared/types/api.generated";

export const usersRepository = (backendApi: TApiFetch) => {
  return {
    getUsers: (query?: Partial<IUserListQuery>, options?: TRequestOptions) => {
      return backendApi<IUserListResponse>("/users", {
        method: "GET",
        query,
        ...options,
      });
    },

    getMyStats: (options?: TRequestOptions) => {
      return backendApi<IProfileStatsResponse>("/users/me/stats", {
        method: "GET",
        ...options,
      });
    },
  };
};

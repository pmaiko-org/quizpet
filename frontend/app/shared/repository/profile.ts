import type { TApiFetch, TRequestOptions } from "~/shared/repository/types";
import type {
  IProfileUpdate,
  ISuccessResponse,
  IUserResponse,
} from "~/shared/types/api.generated";

export const profileRepository = (backendApi: TApiFetch) => {
  return {
    getProfile: (options?: TRequestOptions) => {
      return backendApi<IUserResponse>("/users/me", { ...options });
    },

    updateProfile: (body: IProfileUpdate, options?: TRequestOptions) => {
      return backendApi<IUserResponse>("/users/me", {
        method: "PATCH",
        body,
        ...options,
      });
    },

    deleteAccount: (
      body: { confirmEmail: string },
      options?: TRequestOptions,
    ) => {
      return backendApi<ISuccessResponse>("/users/me", {
        method: "DELETE",
        body,
        ...options,
      });
    },
  };
};

import type { TApiFetch, TRequestOptions } from "~/shared/repository/types";
import type {
  ICardDetailsResponse,
  IEnglishLevelResponse,
  ISetCreate,
  ISetDetailsResponse,
  ISetListQuery,
  ISetListResponse,
  ISetUpdate,
  ISuccessResponse,
  ITopicResponse,
  IUserResponse,
} from "~/shared/types/api.generated";

export const setsRepository = (backendApi: TApiFetch) => {
  return {
    getSets: (query?: Partial<ISetListQuery>, options?: TRequestOptions) => {
      return backendApi<ISetListResponse>("/sets", {
        method: "GET",
        query,
        ...options,
      });
    },

    getSet: (setId: string, options?: TRequestOptions) => {
      return backendApi<ISetDetailsResponse>(`/sets/${setId}`, {
        method: "GET",
        ...options,
      });
    },

    getSetCards: (setId: string, options?: TRequestOptions) => {
      return backendApi<ICardDetailsResponse[]>(`/sets/${setId}/cards`, {
        method: "GET",
        ...options,
      });
    },

    createSet: (data: ISetCreate, options?: TRequestOptions) => {
      return backendApi("/sets", {
        method: "POST",
        body: data,
        ...options,
      });
    },

    updateSet: (setId: string, data: ISetUpdate, options?: TRequestOptions) => {
      return backendApi(`/sets/${setId}`, {
        method: "PATCH",
        body: data,
        ...options,
      });
    },

    deleteSet: (setId: string, options?: TRequestOptions) => {
      return backendApi<ISuccessResponse>(`/sets/${setId}`, {
        method: "DELETE",
        ...options,
      });
    },

    getTopics: (options?: TRequestOptions) => {
      return backendApi<ITopicResponse[]>("/sets/topics", {
        method: "GET",
        ...options,
      });
    },

    getEnglishLevels: (options?: TRequestOptions) => {
      return backendApi<IEnglishLevelResponse[]>("/sets/english-levels", {
        method: "GET",
        ...options,
      });
    },

    getAuthors: (options?: TRequestOptions) => {
      return backendApi<IUserResponse[]>("/sets/authors", {
        method: "GET",
        ...options,
      });
    },
  };
};

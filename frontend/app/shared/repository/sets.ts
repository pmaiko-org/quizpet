import type { $Fetch, NitroFetchRequest } from "nitropack";

import type { TRequestOptions } from "~/shared/repository/types";
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

export const setsRepository = <T>(fetch: $Fetch<T, NitroFetchRequest>) => {
  return {
    getSets: (query?: Partial<ISetListQuery>, options?: TRequestOptions) => {
      return fetch<ISetListResponse>("/sets", {
        method: "GET",
        query,
        ...options,
      });
    },

    getSet: (setId: string, options?: TRequestOptions) => {
      return fetch<ISetDetailsResponse>(`/sets/${setId}`, {
        method: "GET",
        ...options,
      });
    },

    getSetCards: (setId: string, options?: TRequestOptions) => {
      return fetch<ICardDetailsResponse[]>(`/sets/${setId}/cards`, {
        method: "GET",
        ...options,
      });
    },

    createSet: (data: ISetCreate, options?: TRequestOptions) => {
      return fetch("/sets", {
        method: "POST",
        body: data,
        ...options,
      });
    },

    updateSet: (setId: string, data: ISetUpdate, options?: TRequestOptions) => {
      return fetch(`/sets/${setId}`, {
        method: "PATCH",
        body: data,
        ...options,
      });
    },

    deleteSet: (setId: string, options?: TRequestOptions) => {
      return fetch<ISuccessResponse>(`/sets/${setId}`, {
        method: "DELETE",
        ...options,
      });
    },

    getTopics: (options?: TRequestOptions) => {
      return fetch<ITopicResponse[]>("/sets/topics", {
        method: "GET",
        ...options,
      });
    },

    getEnglishLevels: (options?: TRequestOptions) => {
      return fetch<IEnglishLevelResponse[]>("/sets/english-levels", {
        method: "GET",
        ...options,
      });
    },

    getAuthors: (options?: TRequestOptions) => {
      return fetch<IUserResponse[]>("/sets/authors", {
        method: "GET",
        ...options,
      });
    },
  };
};

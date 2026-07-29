import type { $Fetch, NitroFetchRequest } from "nitropack";

import type { TRequestOptions } from "~/repository/types";
import type {
  ICardDetailsResponse,
  ISetCreate,
  ISetDetailsResponse,
  ISetListQuery,
  ISetListResponse,
  ISetUpdate,
  ISuccessResponse,
  ITopicResponse,
} from "~/types/api.generated";

export const setsRepository = <T>(fetch: $Fetch<T, NitroFetchRequest>) => {
  return {
    getSets: (query?: Partial<ISetListQuery>, options?: TRequestOptions) => {
      return fetch<ISetListResponse>("/backend/sets", {
        method: "GET",
        query,
        ...options,
      });
    },

    getSet: (setId: string, options?: TRequestOptions) => {
      return fetch<ISetDetailsResponse>(`/backend/sets/${setId}`, {
        method: "GET",
        ...options,
      });
    },

    getSetCards: (setId: string, options?: TRequestOptions) => {
      return fetch<ICardDetailsResponse[]>(`/backend/sets/${setId}/cards`, {
        method: "GET",
        ...options,
      });
    },

    createSet: (data: ISetCreate, options?: TRequestOptions) => {
      return fetch("/backend/sets", {
        method: "POST",
        body: data,
        ...options,
      });
    },

    updateSet: (setId: string, data: ISetUpdate, options?: TRequestOptions) => {
      return fetch(`/backend/sets/${setId}`, {
        method: "PATCH",
        body: data,
        ...options,
      });
    },

    deleteSet: (setId: string, options?: TRequestOptions) => {
      return fetch<ISuccessResponse>(`/backend/sets/${setId}`, {
        method: "DELETE",
        ...options,
      });
    },

    getTopics: (options?: TRequestOptions) => {
      return fetch<ITopicResponse[]>("/backend/sets/topics", {
        method: "GET",
        ...options,
      });
    },
  };
};

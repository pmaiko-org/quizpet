import type { $Fetch, NitroFetchRequest } from "nitropack";
import type {
  ICreateSet,
  ISetDetailsResponse,
  ITopicResponse,
  IUpdateSet,
  ISuccessResponse,
  ISetListResponse,
} from "~/types/api.generated";

export const setsRepository = <T>(fetch: $Fetch<T, NitroFetchRequest>) => {
  return {
    getSets: async () => {
      const res = await fetch<ISetListResponse>("/backend/sets", {
        method: "GET",
      });
      return res.data;
    },

    getSet: (setId: string) => {
      return fetch<ISetDetailsResponse>(`/backend/sets/${setId}`, {
        method: "GET",
      });
    },

    createSet: (data: ICreateSet) => {
      return fetch("/backend/sets", {
        method: "POST",
        body: data,
      });
    },

    updateSet: (setId: string, data: IUpdateSet) => {
      return fetch(`/backend/sets/${setId}`, {
        method: "PATCH",
        body: data,
      });
    },

    deleteSet: (setId: string) => {
      return fetch<ISuccessResponse>(`/backend/sets/${setId}`, {
        method: "DELETE",
      });
    },

    getTopics: () => {
      return fetch<ITopicResponse[]>("/backend/sets/topics", {
        method: "GET",
      });
    },
  };
};

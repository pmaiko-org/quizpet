import type { $Fetch, NitroFetchRequest } from "nitropack";
import type { ICardPayload } from "~/repository/cards";
import type { IUser } from "~/repository/profile";

export interface Topic {
  id: string;
  label: string;
  value: string;
  icon: string;
  description: string;
}

export interface ISet {
  id: string;
  name: string;
  description: string;
  topics: Topic[];
  user: IUser;
  cardsCount: number;
}

export interface ISetPayload {
  name: string;
  description: string;
  topicIds: string[];
  cards: ICardPayload[];
}

export const setsRepository = <T>(fetch: $Fetch<T, NitroFetchRequest>) => {
  return {
    getSets: () => {
      return fetch<ISet[]>("/backend/sets", {
        method: "GET",
      });
    },

    createSet: (data: ISetPayload) => {
      return fetch("/backend/sets", {
        method: "POST",
        body: data,
      });
    },

    deleteSet: (setId: string) => {
      return fetch<{ success: boolean }>(`/backend/sets/${setId}`, {
        method: "DELETE",
      });
    },


    getTopics: () => {
      return fetch<Topic[]>("/backend/sets/topics", {
        method: "GET",
      });
    },
  };
};

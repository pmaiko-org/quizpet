import type { $Fetch, NitroFetchRequest } from "nitropack";
import type { ICreateCardPayload, ICardDetails, IUpdateCardPayload } from "~/repository/cards";
import type { IUser } from "~/repository/profile";

export interface ITopic {
  id: string;
  label: string;
  value: string;
  icon: string;
  description: string;
}

export interface ISetListItem {
  id: string;
  name: string;
  description: string;
  topics: ITopic[];
  user: IUser;
  cardsCount: number;
}

export interface ISetDetails {
  id: string;
  name: string;
  description: string;
  topics: ITopic[];
  user: IUser;
  cards: ICardDetails[]
}

export interface ICreateSetPayload {
  name: string;
  description: string;
  topicIds: string[];
  cards: ICreateCardPayload[];
}

export interface IUpdateSetPayload extends ICreateSetPayload {
  id: string;
  cards: IUpdateCardPayload[];
}

export const setsRepository = <T>(fetch: $Fetch<T, NitroFetchRequest>) => {
  return {
    getSets: () => {
      return fetch<ISetListItem[]>("/backend/sets", {
        method: "GET",
      });
    },

    getSet: (setId: string) => {
      return fetch<ISetDetails>(`/backend/sets/${setId}`, {
        method: "GET",
      });
    },

    createSet: (data: ICreateSetPayload) => {
      return fetch("/backend/sets", {
        method: "POST",
        body: data,
      });
    },

    updateSet: (setId: string, data: IUpdateSetPayload) => {
      return fetch(`/backend/sets/${setId}`, {
        method: "PATCH",
        body: data,
      });
    },

    deleteSet: (setId: string) => {
      return fetch<{ success: boolean }>(`/backend/sets/${setId}`, {
        method: "DELETE",
      });
    },


    getTopics: () => {
      return fetch<ITopic[]>("/backend/sets/topics", {
        method: "GET",
      });
    },
  };
};

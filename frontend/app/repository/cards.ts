import type { $Fetch, NitroFetchRequest } from "nitropack";
import type {
  ICardDetailsResponse,
  ICreateCard,
  IUpdateCard,
} from "~/types/api.generated";

export type { ICardDetailsResponse, ICreateCard, IUpdateCard };

export const cardsRepository = <T>(fetch: $Fetch<T, NitroFetchRequest>) => {
  return {
    getCards: (setId: string) => {
      return fetch<ICardDetailsResponse[]>(`/backend/cards/${setId}`, {
        method: "GET",
      });
    },
  };
};

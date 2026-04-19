import type { $Fetch, NitroFetchRequest } from "nitropack";
import type { ICardDetailsResponse } from "~/types/api.generated";

export const cardsRepository = <T>(fetch: $Fetch<T, NitroFetchRequest>) => {
  return {
    getCards: (setId: string) => {
      return fetch<ICardDetailsResponse[]>(`/backend/cards/${setId}`, {
        method: "GET",
      });
    },
  };
};

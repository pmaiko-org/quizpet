import type { $Fetch, NitroFetchRequest } from "nitropack";
import type { IStorageFile } from "~/repository/storage-files";

export interface ICardDetails {
  id: string;
  position: number;
  term: string;
  termDescription: string | null;
  termImage: IStorageFile | null;
  definition: string;
  definitionImage: IStorageFile | null;
  textColor: string | null;
  backgroundColor: string | null;
}

export interface ICreateCardPayload
  extends Omit<ICardDetails, "id" | "termImage" | "definitionImage"> {
  termImageId: string | null;
  definitionImageId: string | null;
}

export interface IUpdateCardPayload extends ICreateCardPayload {
  id: string | null;
}

export const cardsRepository = <T>(fetch: $Fetch<T, NitroFetchRequest>) => {
  return {
    getCards: (setId: string) => {
      return fetch<ICardDetails[]>(`/backend/cards/${setId}`, {
        method: "GET",
      });
    },
  };
};

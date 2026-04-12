import type { $Fetch, NitroFetchRequest } from "nitropack";

export interface ICardPayload {
  position: number;
  term: string;
  termImageId: string | null;
  definition: string;
  definitionImageId: string | null;
  textColor: string | null;
  backgroundColor: string | null;
}

export const cardsRepository = <T>(fetch: $Fetch<T, NitroFetchRequest>) => {
  return {};
};

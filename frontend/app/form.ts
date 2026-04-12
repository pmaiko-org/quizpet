import type { IStorageFile } from "~/repository/storage-files";

export const initialSet = (cards: CardFormData[]) => {
  return {
    name: "",
    description: "",
    topicIds: [] as string[],
    cards: [...cards] as CardFormData[],
  };
}

export type SetFormData = ReturnType<typeof initialSet>;

export const initialCard = (position: number) => {
  return {
    position,
    term: "",
    termImage: undefined as IStorageFile | undefined,
    definition: "",
    definitionImage: undefined as IStorageFile | undefined,
    textColor: undefined as string | undefined,
    backgroundColor: undefined as string | undefined,
  };
};

export type CardFormData = ReturnType<typeof initialCard>;

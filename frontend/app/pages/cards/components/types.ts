import type { DeepPartial } from "#ui/types";
import type {
  ICardDetailsResponse,
  IFileResponse,
  ISetDetailsResponse,
} from "~/types/api.generated";

export const initialSet = (set?: DeepPartial<ISetDetailsResponse>) => {
  return {
    id: set?.id || (null as string | null),
    name: set?.name || "",
    description: set?.description || "",
    topicIds: (set?.topics?.map(topic => topic?.id).filter(Boolean)
      || []) as string[],
    cards: set?.cards?.map((card, index) => initialCard(index, card)) || [
      initialCard(0),
      initialCard(1),
    ],
  };
};

export type SetFormData = ReturnType<typeof initialSet>;

export const initialCard = (
  position: number,
  card?: DeepPartial<ICardDetailsResponse>,
) => {
  return {
    id: card?.id || (null as string | null),
    position: card?.position || position,
    term: card?.term || "",
    termDescription: card?.termDescription || "",
    termImage: card?.termImage || (undefined as IFileResponse | undefined),
    definition: card?.definition || "",
    definitionImage:
      card?.definitionImage || (undefined as IFileResponse | undefined),
    textColor: card?.textColor || (undefined as string | undefined),
    backgroundColor: card?.backgroundColor || (undefined as string | undefined),
  };
};

export type ICardFormData = ReturnType<typeof initialCard>;

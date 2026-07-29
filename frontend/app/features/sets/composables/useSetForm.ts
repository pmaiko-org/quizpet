import { FetchError } from "ofetch";

import type {
  ISetCreate,
  ISetUpdate,
  ITopicResponse,
} from "~/types/api.generated";

import type { TCardFormData, TSetFormData } from "../types";
import type { setSchema } from "../validation";

export const useSetForm = () => {
  const { $repository } = useNuxtApp();
  const toast = useToast();
  const router = useRouter();

  const topics = ref<ITopicResponse[]>([]);
  const topicsPending = ref(true);
  const topicsError = shallowRef<unknown>(null);
  const submitting = ref(false);

  const loadTopics = async () => {
    try {
      topicsPending.value = true;
      topicsError.value = null;
      topics.value = await $repository.sets.getTopics();
    } catch (error) {
      topicsError.value = error;
    } finally {
      topicsPending.value = false;
    }
  };

  const saveSet = async (
    data: ReturnType<typeof setSchema.parse>,
    existingCards: TCardFormData[],
    id?: TSetFormData["id"],
  ): Promise<boolean> => {
    const basePayload: ISetCreate = {
      name: data.name,
      description: data.description,
      topicIds: data.topicIds,
      cards: data.cards.map(card => ({
        position: card.position,
        term: card.term,
        termDescription: card.termDescription || null,
        termImageId: card.termImage?.id ?? null,
        definition: card.definition,
        definitionImageId: card.definitionImage?.id ?? null,
        textColor: card.textColor ?? null,
        backgroundColor: card.backgroundColor ?? null,
      })),
    };

    try {
      submitting.value = true;

      if (id) {
        const payload: ISetUpdate = {
          ...basePayload,
          cards: data.cards.map(card => ({
            id: existingCards[card.position]?.id ?? null,
            position: card.position,
            term: card.term,
            termDescription: card.termDescription || null,
            termImageId: card.termImage?.id ?? null,
            definition: card.definition,
            definitionImageId: card.definitionImage?.id ?? null,
            textColor: card.textColor ?? null,
            backgroundColor: card.backgroundColor ?? null,
          })),
        };

        await $repository.sets.updateSet(id, payload);
        await router.push("/sets");
        toast.add({ title: "Набір оновлено", description: "" });

        return false;
      }

      await $repository.sets.createSet(basePayload);
      await router.push("/sets");
      toast.add({ title: "Набір створено", description: "" });

      return true;
    } catch (error) {
      toast.add({
        title: "Не вдалося зберегти набір",
        description:
          error instanceof FetchError
            ? "Перевірте введені дані та спробуйте ще раз."
            : "Спробуйте повторити дію.",
        color: "error",
      });

      return false;
    } finally {
      submitting.value = false;
    }
  };

  return {
    topics,
    topicsPending,
    topicsError,
    submitting,
    loadTopics,
    saveSet,
  };
};

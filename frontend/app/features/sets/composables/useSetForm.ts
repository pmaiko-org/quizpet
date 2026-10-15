import { FetchError } from "ofetch";

import type {
  IEnglishLevelResponse,
  ISetCreate,
  ISetUpdate,
  ITopicResponse,
} from "~/shared/types/api.generated";

import type { TCardFormData, TSetFormData } from "../types";
import type { setSchema } from "../validation";

export const useSetForm = () => {
  const { $repository } = useNuxtApp();
  const toast = useToast();
  const { t } = useI18n();
  const routes = usePageRoutes();

  const topics = ref<ITopicResponse[]>([]);
  const englishLevels = ref<IEnglishLevelResponse[]>([]);
  const optionsPending = ref(true);
  const optionsError = shallowRef<unknown>(null);
  const submitting = ref(false);

  const loadSetOptions = async () => {
    try {
      optionsPending.value = true;
      optionsError.value = null;
      [topics.value, englishLevels.value] = await Promise.all([
        $repository.sets.getTopics(),
        $repository.sets.getEnglishLevels(),
      ]);
    } catch (error) {
      optionsError.value = error;
    } finally {
      optionsPending.value = false;
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
      englishLevelId: data.englishLevelId || null,
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
        await navigateTo(routes.resolve("sets"));
        toast.add({ title: t("sets.toast.updated"), description: "" });

        return false;
      }

      await $repository.sets.createSet(basePayload);
      await navigateTo(routes.resolve("sets"));
      toast.add({ title: t("sets.toast.created"), description: "" });

      return true;
    } catch (error) {
      toast.add({
        title: t("sets.toast.saveError"),
        description:
          error instanceof FetchError
            ? t("sets.toast.validationError")
            : t("sets.toast.retryError"),
        color: "error",
      });

      return false;
    } finally {
      submitting.value = false;
    }
  };

  return {
    topics,
    englishLevels,
    optionsPending,
    optionsError,
    submitting,
    loadSetOptions,
    saveSet,
  };
};

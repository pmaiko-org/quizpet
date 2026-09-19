import { RouteName } from "~/shared/constants";
import type { ICardDetailsResponse } from "~/shared/types/api.generated";

import { canEditSet } from "../utils";

export const useMatchSession = (currentUserEmail: Ref<string | undefined>) => {
  const route = useRoute(RouteName.SETS_ID_MATCH);
  const { $repository } = useNuxtApp();
  const setId = computed(() => route.params.id);
  const {
    data: set,
    status,
    error,
    refresh,
  } = useAsyncData(
    computed(() => `set-matching-${setId.value}`),
    () => $repository.sets.getSet(setId.value),
    { server: false, dedupe: "defer" },
  );
  const cards = computed<ICardDetailsResponse[]>(
    () =>
      set.value?.cards.filter(
        card => card.term.trim() && card.definition.trim(),
      ) ?? [],
  );
  const game = useMatchGame(cards);

  watch(setId, game.reset, { flush: "sync" });

  return {
    ...game,
    setId,
    setName: computed(() => set.value?.name ?? ""),
    availableCount: computed(() => cards.value.length),
    canEdit: computed(() =>
      canEditSet(set.value ?? null, currentUserEmail.value),
    ),
    loading: computed(
      () => status.value === "pending" || status.value === "idle",
    ),
    error,
    refresh,
  };
};

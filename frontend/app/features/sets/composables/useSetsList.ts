import type { Ref } from "vue";

import type {
  ISetListItemResponse,
  ISetListResponse,
} from "~/shared/types/api.generated";

import type { TSetListScope } from "../types";
import { canDeleteSet } from "../utils";
import { useSetFilters } from "./useSetFilters";

export const useSetsList = (currentUserEmail?: Ref<string | undefined>) => {
  const { $repository } = useNuxtApp();
  const route = useRoute();
  const resolvedDefaultScope = ref<TSetListScope | null>(null);
  const loadedScope = ref<TSetListScope | null>(null);

  const requestedScope = computed<TSetListScope | null>(() => {
    const value = route.query.scope;

    return value === "mine" || value === "all" ? value : null;
  });

  const activeScope = computed<TSetListScope>(() => {
    return requestedScope.value ?? resolvedDefaultScope.value ?? "mine";
  });

  const {
    search,
    topicIds,
    englishLevelIds,
    authorIds,
    apiQuery,
    hasActiveFilters,
    clearFilters,
    topics,
    englishLevels,
    authors,
    filterOptionsReady,
    filterOptionsError,
    refreshFilterOptions,
  } = useSetFilters(activeScope);

  const hasRequestedFilters = computed(() => {
    return Object.values(apiQuery.value).some(value =>
      Array.isArray(value) ? value.length : Boolean(value),
    );
  });
  const appliedFilterQuery = computed(() => {
    const isChoosingDefaultScope =
      !requestedScope.value && !resolvedDefaultScope.value;

    return isChoosingDefaultScope && hasRequestedFilters.value
      ? {}
      : apiQuery.value;
  });

  const {
    items: sets,
    meta,
    page,
    pending,
    error,
    refresh,
  } = usePaginatedData<ISetListItemResponse, ISetListResponse>({
    key: "sets",
    request: async (query) => {
      const scope = activeScope.value;
      const response = await $repository.sets.getSets({
        ...query,
        ...appliedFilterQuery.value,
        scope,
      });

      loadedScope.value = scope;

      return response;
    },
    watch: [activeScope, appliedFilterQuery],
  });
  const isResolvingDefaultScope = ref(true);

  watch(
    [meta, pending, error],
    ([currentMeta, isPending, currentError]) => {
      if (requestedScope.value || currentError) {
        isResolvingDefaultScope.value = false;
        return;
      }

      if (
        isPending ||
        !currentMeta ||
        loadedScope.value !== activeScope.value
      ) {
        return;
      }

      if (!resolvedDefaultScope.value) {
        resolvedDefaultScope.value = currentMeta.total ? "mine" : "all";

        if (resolvedDefaultScope.value === "all") {
          return;
        }
      }

      isResolvingDefaultScope.value = false;
    },
    { immediate: true },
  );

  const selectScope = (scope: TSetListScope) => {
    if (scope === activeScope.value) {
      return;
    }

    void navigateTo(
      {
        query: {
          ...route.query,
          page: undefined,
          scope,
          author: scope === "mine" ? undefined : route.query.author,
        },
      },
      { replace: true },
    );
  };

  const totalSets = computed(() => meta.value?.total ?? sets.value.length);

  const stats = computed(() => {
    const topicsCount = new Set(
      sets.value.flatMap(set => set.topics.map(topic => topic.id)),
    ).size;
    const describedSets = sets.value.filter(set =>
      set.description?.trim(),
    ).length;

    return [
      {
        label:
          activeScope.value === "mine" ? "Ваших наборів" : "Усього наборів",
        value: totalSets.value,
        icon: "i-lucide-library",
      },
      {
        label: "Тем на сторінці",
        value: topicsCount,
        icon: "i-lucide-tags",
      },
      {
        label: "З описом на сторінці",
        value: describedSets,
        icon: "i-lucide-file-text",
      },
    ];
  });

  const summaryText = computed(() => {
    const total = totalSets.value;

    if (!total && hasActiveFilters.value) {
      return "За вибраними фільтрами наборів не знайдено.";
    }

    if (!total) {
      return activeScope.value === "mine"
        ? "Створіть перший набір і почніть збирати власну навчальну полицю."
        : "У бібліотеці поки немає доступних наборів.";
    }

    if (total === 1) {
      return activeScope.value === "mine"
        ? "1 ваш набір уже готовий для повторення та подальшого наповнення."
        : "1 набір уже доступний для повторення.";
    }

    const lastDigit = total % 10;
    const lastTwoDigits = total % 100;
    const noun =
      lastDigit === 1 && lastTwoDigits !== 11
        ? "набір"
        : [2, 3, 4].includes(lastDigit) &&
          (lastTwoDigits < 12 || lastTwoDigits > 14)
            ? "набори"
            : "наборів";

    return activeScope.value === "mine"
      ? `${total} ${noun} у вашій навчальній колекції.`
      : `${total} ${noun} доступно в бібліотеці для швидкого повторення.`;
  });

  const canDelete = (set: ISetListItemResponse) => {
    return canDeleteSet(set, currentUserEmail?.value);
  };

  const deletingSetId = ref<string | null>(null);

  const deleteSet = async (set: ISetListItemResponse) => {
    if (deletingSetId.value) {
      return;
    }

    const shouldDelete = window.confirm(
      `Видалити набір "${set.name}"? Цю дію не можна скасувати.`,
    );

    if (!shouldDelete) {
      return;
    }

    deletingSetId.value = set.id;

    try {
      await $repository.sets.deleteSet(set.id);
      await refresh();
    } finally {
      deletingSetId.value = null;
    }
  };

  return {
    sets,
    meta,
    page,
    activeScope,
    selectScope,
    search,
    topicIds,
    englishLevelIds,
    authorIds,
    topics,
    englishLevels,
    authors,
    hasActiveFilters,
    clearFilters,
    filterOptionsReady,
    filterOptionsError,
    refreshFilterOptions,
    stats,
    summaryText,
    canDelete,
    deletingSetId,
    deleteSet,
    pending: computed(() => pending.value || isResolvingDefaultScope.value),
    heroPending: computed(() => pending.value && loadedScope.value === null),
    error,
    refresh,
  };
};

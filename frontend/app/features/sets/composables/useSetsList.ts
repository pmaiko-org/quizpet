import type { Ref } from "vue";

import type {
  ISetListItemResponse,
  ISetListResponse,
} from "~/types/api.generated";

import { canDeleteSet } from "../utils";

export const useSetsList = (currentUserEmail?: Ref<string | undefined>) => {
  const { $repository } = useNuxtApp();

  const {
    data,
    pending: requestPending,
    error,
    refresh,
    status,
  } = useAsyncData(
    "sets",
    () => $repository.sets.getSets(),
    {
      default: () => null as ISetListResponse | null,
      server: false,
      dedupe: "defer",
    },
  );

  const pending = computed(() => {
    return status.value === "idle" || requestPending.value;
  });

  const sets = computed<ISetListItemResponse[]>(() => data.value?.data ?? []);

  const stats = computed(() => {
    const topicsCount = new Set(
      sets.value.flatMap(set => set.topics.map(topic => topic.id)),
    ).size;

    const describedSets = sets.value.filter(set =>
      set.description?.trim(),
    ).length;

    return [
      {
        label: "Усього наборів",
        value: sets.value.length,
        icon: "i-lucide-library",
      },
      {
        label: "Унікальних тематик",
        value: topicsCount,
        icon: "i-lucide-tags",
      },
      {
        label: "З описом",
        value: describedSets,
        icon: "i-lucide-file-text",
      },
    ];
  });

  const summaryText = computed(() => {
    const total = sets.value.length;

    if (!total) {
      return "Почніть з першого набору та зберіть власну навчальну полицю.";
    }

    if (total === 1) {
      return "1 набір уже готовий для повторення та подальшого наповнення.";
    }

    return `${total} набори зібрано в одній бібліотеці для швидкого доступу.`;
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
    stats,
    summaryText,
    canDelete,
    deletingSetId,
    deleteSet,
    pending,
    error,
    refresh,
  };
};

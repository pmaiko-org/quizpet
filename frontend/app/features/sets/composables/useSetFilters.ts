import { watchDebounced } from "@vueuse/core";
import type { Ref } from "vue";

import type {
  IEnglishLevelResponse,
  ISetListQuery,
  ITopicResponse,
  IUserResponse,
} from "~/shared/types/api.generated";

import type { ISetAuthorOption, TSetListScope } from "../types";

type TFilterQueryValue = string | string[] | undefined;

interface ISetFilterQueryUpdates {
  search?: TFilterQueryValue;
  topic?: TFilterQueryValue;
  level?: TFilterQueryValue;
  author?: TFilterQueryValue;
}

const getQueryValues = (value: unknown) => {
  const values = Array.isArray(value) ? value : [value];

  return values.filter(
    (item): item is string => typeof item === "string" && Boolean(item),
  );
};

const getQueryValue = (value: unknown) => getQueryValues(value)[0];

export const useSetFilters = (activeScope: Readonly<Ref<TSetListScope>>) => {
  const { $repository } = useNuxtApp();
  const route = useRoute();

  const updateFilterQuery = (updates: ISetFilterQueryUpdates) => {
    const hasChanges = Object.entries(updates).some(([key, value]) => {
      const currentValues = getQueryValues(route.query[key]);
      const nextValues = getQueryValues(value);

      return JSON.stringify(currentValues) !== JSON.stringify(nextValues);
    });

    if (!hasChanges) {
      return;
    }

    void navigateTo(
      {
        query: {
          ...route.query,
          ...updates,
          page: undefined,
        },
      },
      { replace: true },
    );
  };

  const search = ref(getQueryValue(route.query.search) ?? "");
  const topicIds = computed<string[]>({
    get: () => getQueryValues(route.query.topic),
    set: value =>
      updateFilterQuery({ topic: value.length ? value : undefined }),
  });
  const englishLevelIds = computed<string[]>({
    get: () => getQueryValues(route.query.level),
    set: value =>
      updateFilterQuery({ level: value.length ? value : undefined }),
  });
  const authorIds = computed<string[]>({
    get: () => getQueryValues(route.query.author),
    set: value =>
      updateFilterQuery({ author: value.length ? value : undefined }),
  });

  watch(
    () => route.query.search,
    (value) => {
      const nextSearch = getQueryValue(value) ?? "";

      if (nextSearch !== search.value) {
        search.value = nextSearch;
      }
    },
  );

  watchDebounced(
    search,
    value => updateFilterQuery({ search: value.trim() || undefined }),
    { debounce: 300, maxWait: 800 },
  );

  const apiQuery = computed<Partial<ISetListQuery>>(() => ({
    search: getQueryValue(route.query.search),
    topicIds: topicIds.value.length ? topicIds.value : undefined,
    englishLevelIds: englishLevelIds.value.length
      ? englishLevelIds.value
      : undefined,
    authorIds:
      activeScope.value === "all" && authorIds.value.length
        ? authorIds.value
        : undefined,
  }));

  const hasActiveFilters = computed(() => {
    return Boolean(
      search.value.trim() ||
      topicIds.value.length ||
      englishLevelIds.value.length ||
      (activeScope.value === "all" && authorIds.value.length),
    );
  });

  const clearFilters = () => {
    search.value = "";
    updateFilterQuery({
      search: undefined,
      topic: undefined,
      level: undefined,
      author: undefined,
    });
  };

  const {
    data: filterOptions,
    status: filterOptionsStatus,
    error: filterOptionsError,
    refresh: refreshFilterOptions,
  } = useAsyncData(
    "set-filter-options",
    async () => {
      const [topics, englishLevels, authors] = await Promise.all([
        $repository.sets.getTopics(),
        $repository.sets.getEnglishLevels(),
        $repository.sets.getAuthors(),
      ]);

      return { topics, englishLevels, authors };
    },
    {
      server: false,
      default: () => ({
        topics: [] as ITopicResponse[],
        englishLevels: [] as IEnglishLevelResponse[],
        authors: [] as IUserResponse[],
      }),
      dedupe: "defer",
    },
  );

  const authors = computed<ISetAuthorOption[]>(() => {
    return filterOptions.value.authors.map((author) => {
      const fullName = [author.firstName, author.lastName]
        .filter(Boolean)
        .join(" ")
        .trim();

      return {
        id: author.id,
        label: fullName || author.email,
      };
    });
  });

  return {
    search,
    topicIds,
    englishLevelIds,
    authorIds,
    apiQuery,
    hasActiveFilters,
    clearFilters,
    topics: computed(() => filterOptions.value.topics),
    englishLevels: computed(() => filterOptions.value.englishLevels),
    authors,
    filterOptionsReady: computed(() => filterOptionsStatus.value === "success"),
    filterOptionsError,
    refreshFilterOptions,
  };
};

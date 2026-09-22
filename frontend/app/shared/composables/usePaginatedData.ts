import type { WatchSource } from "vue";

import type {
  IPaginationMeta,
  IPaginationQuery,
} from "~/shared/types/api.generated";

interface IPaginatedResponse<TItem> {
  data: TItem[];
  meta: IPaginationMeta;
}

interface IUsePaginatedDataOptions<
  TItem,
  TResponse extends IPaginatedResponse<TItem>,
> {
  key: string;
  request: (query: Partial<IPaginationQuery>) => Promise<TResponse>;
  watch?: WatchSource[];
}

const parsePage = (value: unknown) => {
  const rawValue = Array.isArray(value) ? value[0] : value;
  const parsedValue = Number(rawValue);

  return Number.isInteger(parsedValue) && parsedValue > 0 ? parsedValue : 1;
};

export const usePaginatedData = <
  TItem,
  TResponse extends IPaginatedResponse<TItem>,
>({
  key,
  request,
  watch: requestWatchSources = [],
}: IUsePaginatedDataOptions<TItem, TResponse>) => {
  const route = useRoute();

  const page = computed<number>({
    get: () => parsePage(route.query.page),
    set: (value) => {
      const nextPage = parsePage(value);

      if (nextPage === page.value) {
        return;
      }

      void navigateTo(
        {
          query: {
            ...route.query,
            page: nextPage === 1 ? undefined : String(nextPage),
          },
        },
        { replace: true },
      );
    },
  });

  const {
    data,
    pending: requestPending,
    error,
    refresh,
    status,
  } = useAsyncData<IPaginatedResponse<TItem>>(
    key,
    () => request({ page: page.value }),
    {
      server: false,
      watch: [page, ...requestWatchSources],
      dedupe: "cancel",
    },
  );

  const items = computed<TItem[]>(() => data.value?.data ?? []);
  const meta = computed<IPaginationMeta | null>(() => data.value?.meta ?? null);
  const pending = computed(
    () => status.value === "idle" || requestPending.value,
  );

  watch(meta, (currentMeta) => {
    if (!currentMeta) {
      return;
    }

    const lastPage = Math.max(currentMeta.pages, 1);

    if (page.value > lastPage) {
      page.value = lastPage;
    }
  });

  return {
    items,
    meta,
    page,
    pending,
    error,
    refresh,
  };
};

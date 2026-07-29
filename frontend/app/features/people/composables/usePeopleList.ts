import type {
  IPaginationMeta,
  IUserListResponse,
  IUserResponse,
} from "~/types/api.generated";

export const usePeopleList = () => {
  const { $repository } = useNuxtApp();

  const perPage = 20;
  const page = ref(1);

  const {
    data,
    pending: requestPending,
    error,
    refresh,
    status,
  } = useAsyncData(
    "peoples",
    () => $repository.users.getUsers({ page: page.value, perPage }),
    {
      default: () => null as IUserListResponse | null,
      server: false,
      watch: [page],
      dedupe: "defer",
    },
  );

  const pending = computed(() => {
    return status.value === "idle" || requestPending.value;
  });

  const users = computed<IUserResponse[]>(() => data.value?.data ?? []);
  const meta = computed<IPaginationMeta | null>(() => data.value?.meta ?? null);

  return {
    users,
    meta,
    page,
    perPage,
    pending,
    error,
    refresh,
  };
};

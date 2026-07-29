import type { IPaginationMeta, IUserResponse } from "~/types/api.generated";

export const usePeopleList = () => {
  const { $repository } = useNuxtApp();

  const perPage = 20;
  const page = ref(1);

  const { data, pending, error, refresh } = useAsyncData(
    "peoples",
    () => $repository.users.getUsers({ page: page.value, perPage }),
    { server: false, watch: [page] },
  );

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

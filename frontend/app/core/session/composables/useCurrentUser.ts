import type { IUserResponse } from "~/shared/types/api.generated";

export const useCurrentUser = () => {
  const { $repository } = useNuxtApp();
  const { isLoggedIn } = storeToRefs(useAuthStore());

  const {
    data: user,
    status,
    error,
    refresh,
  } = useAsyncData(
    "current-user",
    () =>
      isLoggedIn.value
        ? $repository.profile.getProfile()
        : Promise.resolve(null),
    {
      server: false,
      default: () => null as IUserResponse | null,
      dedupe: "defer",
    },
  );

  const email = computed(() => user.value?.email);
  const pending = useClientAsyncDataPending(status);

  return { user, email, pending, error, refresh };
};

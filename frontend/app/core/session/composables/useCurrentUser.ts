import type { IUserResponse } from "~/types/api.generated";

export const useCurrentUser = () => {
  const { $repository } = useNuxtApp();
  const { isLoggedIn } = storeToRefs(useAuthStore());

  const {
    data: user,
    pending,
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
    },
  );

  const email = computed(() => user.value?.email);

  return { user, email, pending, error, refresh };
};

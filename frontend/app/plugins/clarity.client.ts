import Clarity from "@microsoft/clarity";

export default defineNuxtPlugin(() => {
  const { clarityProjectId } = useRuntimeConfig().public;

  if (!clarityProjectId) return;

  Clarity.init(clarityProjectId);

  const route = useRoute();
  const { isLoggedIn } = storeToRefs(useAuthStore());
  const { user, refresh } = useCurrentUser();

  watch(
    isLoggedIn,
    async (loggedIn, wasLoggedIn) => {
      Clarity.setTag("auth_status", loggedIn ? "authenticated" : "anonymous");

      if (loggedIn && wasLoggedIn === false) {
        await refresh();
      }
    },
    { immediate: true },
  );

  watch(
    [() => user.value?.id, () => route.path],
    ([userId, pageId]) => {
      if (userId) {
        Clarity.identify(userId, undefined, pageId);
      }
    },
    { immediate: true },
  );
});

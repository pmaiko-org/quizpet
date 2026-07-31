import { RouteName } from "~/constants";

export const useSetEdit = () => {
  const route = useRoute(RouteName.SETS_ID_EDIT);
  const { $repository } = useNuxtApp();

  const setId = computed(() => route.params.id);
  const asyncDataKey = computed(() => `set-edit-${setId.value}`);

  const {
    data: set,
    status,
    error,
    refresh,
  } = useAsyncData(asyncDataKey, () => $repository.sets.getSet(setId.value), {
    server: false,
    dedupe: "defer",
  });

  return {
    set,
    status,
    error,
    refresh,
    setId,
  };
};

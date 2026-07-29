export const useSetEdit = () => {
  const route = useRoute();
  const { $repository } = useNuxtApp();

  const setId = computed(() => route.params.id as string);
  const asyncDataKey = computed(() => `set-edit-${setId.value}`);

  const {
    data: set,
    status,
    error,
    refresh,
  } = useAsyncData(
    asyncDataKey,
    () => $repository.sets.getSet(setId.value),
    {
      server: false,
      dedupe: "defer",
    },
  );

  return {
    set,
    status,
    error,
    refresh,
    setId,
  };
};

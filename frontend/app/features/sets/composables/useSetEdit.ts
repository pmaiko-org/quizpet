export const useSetEdit = () => {
  const cmsPage = useCmsPage();
  const { $repository } = useNuxtApp();

  const setId = computed(() => cmsPage.params.value.id ?? "");
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

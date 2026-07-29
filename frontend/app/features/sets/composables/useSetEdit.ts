export const useSetEdit = () => {
  const route = useRoute();
  const { $repository } = useNuxtApp();

  const setId = computed(() => route.params.id as string);

  const { data: set, status } = useAsyncData(
    `set-edit-${setId.value}`,
    () => $repository.sets.getSet(setId.value),
    {
      server: false,
    },
  );

  return {
    set,
    status,
    setId,
  };
};

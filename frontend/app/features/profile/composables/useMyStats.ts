export const useMyStats = () => {
  const { $repository } = useNuxtApp();

  const {
    data,
    pending: requestPending,
    status,
    error,
    refresh,
  } = useAsyncData("sidebar-stats", () => $repository.users.getMyStats(), {
    default: () => ({
      peopleCount: 0,
      mySetsCount: 0,
      myTopicsCount: 0,
    }),
    server: false,
    dedupe: "defer",
  });

  const pending = computed(
    () => requestPending.value || status.value === "idle",
  );

  return {
    stats: data,
    pending,
    error,
    refresh,
  };
};

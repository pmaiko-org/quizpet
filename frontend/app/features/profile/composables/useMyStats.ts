export const useMyStats = () => {
  const { $repository } = useNuxtApp();

  const { data, status, error, refresh } = useAsyncData(
    "sidebar-stats",
    () => $repository.users.getMyStats(),
    {
      default: () => ({
        peopleCount: 0,
        mySetsCount: 0,
        myTopicsCount: 0,
      }),
      server: false,
      dedupe: "defer",
    },
  );

  const pending = useClientAsyncDataPending(status);

  return {
    stats: data,
    pending,
    error,
    refresh,
  };
};

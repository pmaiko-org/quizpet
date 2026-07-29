export const useMyStats = () => {
  const { $repository } = useNuxtApp();

  const { data, pending, error, refresh } = useAsyncData(
    "sidebar-stats",
    () => $repository.users.getMyStats(),
    {
      default: () => ({
        peopleCount: 0,
        mySetsCount: 0,
        myTopicsCount: 0,
      }),
      server: false,
    },
  );

  return {
    stats: data,
    pending,
    error,
    refresh,
  };
};

export const useAuthSessions = () => {
  const { $repository } = useNuxtApp();
  const authStore = useAuthStore();
  const busySessionId = ref<string | null>(null);
  const revokingOthers = ref(false);

  const { data, status, error, refresh } = useAsyncData(
    "auth-sessions",
    () => $repository.auth.getSessions(),
    { server: false, default: () => [] },
  );
  const pending = useClientAsyncDataPending(status);

  const revokeSession = async (sessionId: string, current: boolean) => {
    if (current) {
      await authStore.doLogout();
      return;
    }

    busySessionId.value = sessionId;
    try {
      await $repository.auth.revokeSession(sessionId);
      await refresh();
    } finally {
      busySessionId.value = null;
    }
  };

  const revokeOtherSessions = async () => {
    revokingOthers.value = true;
    try {
      await $repository.auth.revokeOtherSessions();
      await refresh();
    } finally {
      revokingOthers.value = false;
    }
  };

  return {
    sessions: data,
    pending,
    error,
    busySessionId,
    revokingOthers,
    refresh,
    revokeSession,
    revokeOtherSessions,
  };
};

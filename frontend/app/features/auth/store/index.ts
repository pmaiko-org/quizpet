import { useLocalStorage } from "@vueuse/core";
import type {
  IRefreshToken,
  IRefreshTokenResponse,
} from "~/types/api.generated";

export const useAuthStore = () => {
  const apiUrl = useApiUrl();

  const accessToken = useCookie<string | null>("accessToken", {
    default: () => null,
    sameSite: "lax",
    secure: true,
    maxAge: 60 * 60 * 24 * 60,
  });

  const refreshToken = useLocalStorage<string | null>("refreshToken", null);

  const isLoggedIn = computed(() => Boolean(accessToken.value));

  const setTokens = (newAccessToken: string, newRefreshToken: string) => {
    accessToken.value = newAccessToken;
    refreshToken.value = newRefreshToken;
  };

  const clearTokens = () => {
    accessToken.value = null;
    refreshToken.value = null;
  };

  const logoutPromise = useState<Promise<void> | null>(
    "logoutPromise",
    () => null,
  );
  const isLoggingOut = computed(() => Boolean(logoutPromise.value));

  const doLogout = async () => {
    if (logoutPromise.value) {
      await logoutPromise.value;
      return;
    }

    logoutPromise.value = (async () => {
      clearTokens();

      const route = useRoute();
      if (route.path !== "/login") {
        await navigateTo("/login");
      }
    })();

    try {
      await logoutPromise.value;
    } finally {
      logoutPromise.value = null;
    }
  };

  const getTokenEntry = (accessToken: string | null) => {
    if (!accessToken) return "";
    return `Bearer ${accessToken}`;
  };

  const promiseAuthRefreshToken
    = useState<Promise<IRefreshTokenResponse> | null>(
      "promiseRefreshToken",
      () => null,
    );

  const authRefreshToken = async () => {
    if (!refreshToken.value) {
      clearTokens();
      return;
    }

    promiseAuthRefreshToken.value
      = promiseAuthRefreshToken.value
        || $fetch<IRefreshTokenResponse>(`${apiUrl}/auth/refresh`, {
          method: "POST",
          body: {
            refreshToken: refreshToken.value,
          } satisfies IRefreshToken,
        });

    try {
      const response = await promiseAuthRefreshToken.value;
      accessToken.value = response.accessToken;
      return response.accessToken;
    } catch (error) {
      console.error("Error refreshing token:", error);
    } finally {
      promiseAuthRefreshToken.value = null;
    }
  };

  return {
    accessToken,
    refreshToken,
    isLoggedIn,
    isLoggingOut,
    setTokens,
    clearTokens,
    doLogout,
    getTokenEntry,
    authRefreshToken,
  } as const;
};

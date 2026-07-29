import { useLocalStorage } from "@vueuse/core";
import { skipHydrate } from "pinia";

import type {
  IRefreshToken,
  IRefreshTokenResponse,
} from "~/types/api.generated";

export const useAuthStore = defineStore("auth", () => {
  const apiUrl = useApiUrl();

  const accessToken = skipHydrate(
    useCookie<string | null>("accessToken", {
      default: () => null,
      sameSite: "lax",
      secure: true,
      maxAge: 60 * 60 * 24 * 60,
    }),
  );

  const refreshToken = skipHydrate(
    useLocalStorage<string | null>("refreshToken", null),
  );

  const isLoggedIn = computed(() => Boolean(accessToken.value));

  const setTokens = (newAccessToken: string, newRefreshToken: string) => {
    accessToken.value = newAccessToken;
    refreshToken.value = newRefreshToken;
  };

  const clearTokens = () => {
    accessToken.value = null;
    refreshToken.value = null;
  };

  const logoutPromise = skipHydrate(ref<Promise<void> | null>(null));
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

  const promiseAuthRefreshToken = skipHydrate(
    ref<Promise<IRefreshTokenResponse> | null>(null),
  );

  const authRefreshToken = async () => {
    if (!refreshToken.value) {
      clearTokens();
      return;
    }

    promiseAuthRefreshToken.value =
      promiseAuthRefreshToken.value ||
      $fetch<IRefreshTokenResponse>(`${apiUrl}/auth/refresh`, {
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
    logoutPromise,
    promiseAuthRefreshToken,
    isLoggedIn,
    isLoggingOut,
    setTokens,
    clearTokens,
    doLogout,
    getTokenEntry,
    authRefreshToken,
  };
});

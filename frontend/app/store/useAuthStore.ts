import { useLocalStorage } from "@vueuse/core";

export const useAuthStore = () => {
  const accessToken = useCookie<string | null>("accessToken", {
    default: () => null,
    sameSite: "lax",
    secure: true,
    maxAge: 60 * 60 * 24 * 60,
  });

  const refreshToken = useLocalStorage<string | null>("refreshToken", null);

  const isLoggedIn = computed(
    () => Boolean(accessToken.value)
  );

  const setTokens = (newAccessToken: string, newRefreshToken: string) => {
    accessToken.value = newAccessToken;
    refreshToken.value = newRefreshToken;
  };

  const clearTokens = () => {
    accessToken.value = null;
    refreshToken.value = null;
  };

  const getTokenEntry = () => {
    return `Bearer ${accessToken.value}`
  }

  return {
    accessToken,
    refreshToken,
    isLoggedIn,
    setTokens,
    clearTokens,
    getTokenEntry,
  } as const;
};
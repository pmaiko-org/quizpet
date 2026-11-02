import { useLocalStorage } from "@vueuse/core";
import { FetchError } from "ofetch";
import { skipHydrate } from "pinia";

import type {
  IAccessTokenResponse,
  IAuthStatusResponse,
  IOAuthHandoff,
} from "~/shared/types/api.generated";

import { isAccessTokenUsable } from "../utils/auth-token";

const ACCESS_TOKEN_KEY = "quizpet-access-token";
const CSRF_COOKIE = "qp_csrf";
const REFRESH_LEASE_KEY = "quizpet-auth-refresh-lease";
const REFRESH_LEASE_MS = 8_000;

type TRefreshLease = {
  owner: string;
  expiresAt: number;
};

export const useAuthStore = defineStore("auth", () => {
  const backendApiUrl = useBackendApiUrl();
  const routes = usePageRoutes();
  const requestHeaders = import.meta.server
    ? useRequestHeaders(["cookie"])
    : undefined;
  const accessToken = skipHydrate(
    useLocalStorage<string | null>(ACCESS_TOKEN_KEY, null),
  );
  const serverAuthenticated = ref(false);
  const serverInitialized = ref(false);
  const clientInitialized = skipHydrate(ref(false));
  const refreshPromise = skipHydrate(ref<Promise<string | null> | null>(null));
  const logoutPromise = skipHydrate(ref<Promise<void> | null>(null));
  const { message, post } = useAuthBroadcast();

  const isLoggedIn = computed(() => {
    if (import.meta.server) return serverAuthenticated.value;
    if (!clientInitialized.value) return serverAuthenticated.value;
    return isAccessTokenUsable(accessToken.value);
  });
  const isLoggingOut = computed(() => Boolean(logoutPromise.value));

  const csrfToken = () => {
    refreshCookie(CSRF_COOKIE);
    return useCookie<string | null>(CSRF_COOKIE).value;
  };

  const mutationHeaders = () => {
    const token = csrfToken();
    return token ? { "x-csrf-token": token } : undefined;
  };

  const setAccessToken = (token: string) => {
    accessToken.value = token;
    serverAuthenticated.value = true;
    clientInitialized.value = true;
  };

  const clearAuth = () => {
    accessToken.value = null;
    serverAuthenticated.value = false;
    clientInitialized.value = true;
    clearNuxtData(key => !key.startsWith("cms:"));
  };

  const redirectToLogin = async () => {
    const loginPath = routes.resolve("login");
    if (useRoute().path !== loginPath) {
      await navigateTo(loginPath, { replace: true });
    }
  };

  const requestRefresh = async () => {
    try {
      const response = await $fetch<IAccessTokenResponse>(
        `${backendApiUrl}/auth/refresh`,
        {
          method: "POST",
          credentials: "include",
          headers: mutationHeaders(),
        },
      );
      setAccessToken(response.accessToken);
      post({ type: "refreshed", at: Date.now() });
      return response.accessToken;
    } catch (error) {
      if (error instanceof FetchError && error.statusCode === 409) {
        const token = await waitForAnotherTab(accessToken.value);
        if (token) return token;
      }
      if (
        error instanceof FetchError &&
        (error.statusCode === 401 || error.statusCode === 403)
      ) {
        clearAuth();
        post({ type: "logout", at: Date.now() });
        await redirectToLogin();
      }
      return null;
    }
  };

  const waitForAnotherTab = async (previousToken: string | null) => {
    const deadline = Date.now() + REFRESH_LEASE_MS;
    while (Date.now() < deadline) {
      await new Promise(resolve => setTimeout(resolve, 100));
      const nextToken = localStorage.getItem(ACCESS_TOKEN_KEY);
      if (
        nextToken &&
        nextToken !== previousToken &&
        isAccessTokenUsable(nextToken)
      ) {
        setAccessToken(nextToken);
        return nextToken;
      }
    }
    return null;
  };

  const refreshWithLease = async () => {
    const owner = crypto.randomUUID();
    const previousToken = accessToken.value;
    const currentValue = localStorage.getItem(REFRESH_LEASE_KEY);

    if (currentValue) {
      try {
        const current = JSON.parse(currentValue) as TRefreshLease;
        if (current.expiresAt > Date.now()) {
          const token = await waitForAnotherTab(previousToken);
          if (token) return token;
        }
      } catch {
        localStorage.removeItem(REFRESH_LEASE_KEY);
      }
    }

    const lease: TRefreshLease = {
      owner,
      expiresAt: Date.now() + REFRESH_LEASE_MS,
    };
    localStorage.setItem(REFRESH_LEASE_KEY, JSON.stringify(lease));

    try {
      const claimed = JSON.parse(
        localStorage.getItem(REFRESH_LEASE_KEY) ?? "{}",
      ) as Partial<TRefreshLease>;
      if (claimed.owner !== owner) {
        return waitForAnotherTab(previousToken);
      }
      return requestRefresh();
    } finally {
      const claimed = localStorage.getItem(REFRESH_LEASE_KEY);
      if (claimed) {
        try {
          if ((JSON.parse(claimed) as TRefreshLease).owner === owner) {
            localStorage.removeItem(REFRESH_LEASE_KEY);
          }
        } catch {
          localStorage.removeItem(REFRESH_LEASE_KEY);
        }
      }
    }
  };

  const authRefreshToken = async () => {
    if (import.meta.server) return null;
    if (refreshPromise.value) return refreshPromise.value;

    const tokenBeforeLock = accessToken.value;
    refreshPromise.value = (async () => {
      if (navigator.locks) {
        return navigator.locks.request("quizpet-auth-refresh", async () => {
          const storedToken = localStorage.getItem(ACCESS_TOKEN_KEY);
          if (
            storedToken &&
            storedToken !== tokenBeforeLock &&
            isAccessTokenUsable(storedToken)
          ) {
            setAccessToken(storedToken);
            return storedToken;
          }
          return requestRefresh();
        });
      }
      return refreshWithLease();
    })();

    try {
      return await refreshPromise.value;
    } finally {
      refreshPromise.value = null;
    }
  };

  const ensureAuth = async () => {
    if (import.meta.server) {
      if (serverInitialized.value) return;
      try {
        const response = await $fetch<IAuthStatusResponse>(
          `${backendApiUrl}/auth/status`,
          { headers: requestHeaders },
        );
        serverAuthenticated.value = response.authenticated;
      } catch {
        serverAuthenticated.value = false;
      } finally {
        serverInitialized.value = true;
      }
      return;
    }

    if (clientInitialized.value) return;
    if (serverInitialized.value && !serverAuthenticated.value) {
      accessToken.value = null;
      clientInitialized.value = true;
      return;
    }
    if (isAccessTokenUsable(accessToken.value)) {
      serverAuthenticated.value = true;
      clientInitialized.value = true;
      return;
    }
    await authRefreshToken();
    clientInitialized.value = true;
  };

  const exchangeOAuthCode = async (code: string) => {
    const response = await $fetch<IAccessTokenResponse>(
      `${backendApiUrl}/auth/handoff`,
      {
        method: "POST",
        credentials: "include",
        headers: mutationHeaders(),
        body: { code } satisfies IOAuthHandoff,
      },
    );
    setAccessToken(response.accessToken);
    post({ type: "refreshed", at: Date.now() });
  };

  const doLogout = async () => {
    if (logoutPromise.value) return logoutPromise.value;

    logoutPromise.value = (async () => {
      await $fetch(`${backendApiUrl}/auth/logout`, {
        method: "POST",
        credentials: "include",
        headers: mutationHeaders(),
      }).catch(() => undefined);
      clearAuth();
      post({ type: "logout", at: Date.now() });
      await redirectToLogin();
    })();

    try {
      await logoutPromise.value;
    } finally {
      logoutPromise.value = null;
    }
  };

  if (import.meta.client) {
    watch(message, (value) => {
      if (!value) return;
      if (value.type === "refreshed") {
        const storedToken = localStorage.getItem(ACCESS_TOKEN_KEY);
        if (storedToken && isAccessTokenUsable(storedToken)) {
          setAccessToken(storedToken);
        }
        return;
      }

      clearAuth();
      void redirectToLogin();
    });
  }

  return {
    accessToken,
    serverAuthenticated,
    serverInitialized,
    clientInitialized,
    refreshPromise,
    logoutPromise,
    isLoggedIn,
    isLoggingOut,
    setAccessToken,
    clearAuth,
    ensureAuth,
    authRefreshToken,
    exchangeOAuthCode,
    doLogout,
  };
});

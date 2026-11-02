import { isAccessTokenUsable } from "~/core/session/utils/auth-token";
import { StatusCodes } from "~/shared/constants";
import { createRepository } from "~/shared/repository";
import type { TApiFetch } from "~/shared/repository/types";

const RETRY_FLAG = "_retryAfterAuthRefresh";

const isRefreshExcluded = (request: unknown) => {
  const path = String(request);
  return ["/auth/handoff", "/auth/refresh", "/auth/status"].some(value =>
    path.includes(value),
  );
};

export default defineNuxtPlugin({
  name: "api",
  setup() {
    const backendApiUrl = useBackendApiUrl();
    const cmsApiUrl = useCmsApiUrl();
    const authStore = useAuthStore();
    const { accessToken, isLoggingOut } = storeToRefs(authStore);

    const backendApi: TApiFetch = $fetch.create({
      baseURL: backendApiUrl,
      credentials: "include",
      retry: 1,
      retryStatusCodes: [StatusCodes.UNAUTHORIZED],

      onRequest({ request, options }) {
        options.headers.set("accept-language", "uk");
        if (
          !isRefreshExcluded(request) &&
          isAccessTokenUsable(accessToken.value)
        ) {
          options.headers.set("authorization", `Bearer ${accessToken.value}`);
        } else {
          options.headers.delete("authorization");
        }
      },

      async onResponseError({ request, response, options }) {
        if (response.status !== StatusCodes.UNAUTHORIZED) return;

        const retryState = options as unknown as Record<string, unknown>;
        if (retryState[RETRY_FLAG] || isRefreshExcluded(request)) {
          options.retry = 0;
          authStore.clearAuth();
          return;
        }

        if (!accessToken.value || isLoggingOut.value) {
          options.retry = 0;
          return;
        }

        retryState[RETRY_FLAG] = true;
        if (!(await authStore.authRefreshToken())) {
          options.retry = 0;
        }
      },
    });

    const cmsApi: TApiFetch = $fetch.create({
      baseURL: cmsApiUrl,
      headers: import.meta.server ? useRequestHeaders(["cookie"]) : undefined,
    });

    return {
      provide: {
        backendApi,
        cmsApi,
        repository: createRepository(backendApi, cmsApi),
      },
    };
  },
});

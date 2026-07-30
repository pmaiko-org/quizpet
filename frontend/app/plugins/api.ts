import { FetchError } from "ofetch";

import { StatusCodes } from "~/constants";
import { createRepository } from "~/repository";

export default defineNuxtPlugin(() => {
  const apiUrl = useApiUrl();
  const authStore = useAuthStore();
  const { accessToken } = storeToRefs(authStore);
  const { getTokenEntry, authRefreshToken, doLogout } = authStore;

  const RETRY_FLAG = "_retryAfterRefresh";

  const inflight = new Set<AbortController>();
  const controllerByOptions = new WeakMap<object, AbortController>();

  const abortAll = () => {
    inflight.forEach(controller => controller.abort());
    inflight.clear();
  };

  const untrack = (options: object) => {
    const controller = controllerByOptions.get(options);
    if (!controller) return;

    inflight.delete(controller);
    controllerByOptions.delete(options);
  };

  const api = $fetch.create({
    baseURL: apiUrl,
    credentials: "omit",
    retry: false,

    onRequest({ options }) {
      options.headers.set("accept-language", "uk");
      options.headers.set("authorization", getTokenEntry(accessToken.value));

      const controller = new AbortController();
      inflight.add(controller);
      controllerByOptions.set(options, controller);

      const callerSignal = options.signal;
      if (callerSignal) {
        if (callerSignal.aborted) {
          controller.abort(callerSignal.reason);
        } else {
          callerSignal.addEventListener(
            "abort",
            () => controller.abort(callerSignal.reason),
            { once: true },
          );
        }
      }

      options.signal = controller.signal;
    },

    onRequestError({ options }) {
      untrack(options);
    },

    async onResponse(context): Promise<void> {
      untrack(context.options);

      if (context.response.status === StatusCodes.UNAUTHORIZED) {
        const options = context.options as unknown as Record<string, unknown>;
        const isRetried = options[RETRY_FLAG];

        if (isRetried) {
          abortAll();
          await doLogout();
          return;
        }

        const newAccessToken = await authRefreshToken();
        if (!newAccessToken) {
          abortAll();
          await doLogout();
          return;
        }

        const retryOptions = {
          ...context.options,
          [RETRY_FLAG]: true,
        } as Record<string, unknown>;

        try {
          await api(context.request, {
            ...retryOptions,
            onResponse(ctx) {
              Object.assign(context, ctx);
            },
          });
        } catch (error) {
          if (error instanceof FetchError) {
            console.error("Request retry after token refresh failed");
          }
        }
      }
    },
  });

  return {
    provide: {
      api,
      repository: createRepository(api),
    },
  };
});

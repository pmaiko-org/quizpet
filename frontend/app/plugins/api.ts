import { createRepository } from "~/repository";
import { StatusCodes } from "~/constants";
import { FetchError } from "ofetch";

export default defineNuxtPlugin(() => {
  const apiUrl = useApiUrl();
  const { accessToken, getTokenEntry, authRefreshToken, doLogout }
    = useAuthStore();
  const { addAbortController, executeAllAbortControllers } = useRequestStore();

  const RETRY_FLAG = "_retryAfterRefresh";

  const api = $fetch.create({
    baseURL: apiUrl,
    credentials: "omit",
    retry: false,

    async onRequest({ options }) {
      options.headers.set("accept-language", "uk");
      options.headers.set("authorization", getTokenEntry(accessToken.value));

      const controller = new AbortController();
      addAbortController(controller);
      options.signal = controller.signal;
    },

    async onResponse(context): Promise<void> {
      if (context.response.status === StatusCodes.UNAUTHORIZED) {
        const options = context.options as unknown as Record<string, unknown>;
        const isRetried = options[RETRY_FLAG];

        if (isRetried) {
          executeAllAbortControllers();
          await doLogout();
          return;
        }

        const newAccessToken = await authRefreshToken();
        if (!newAccessToken) {
          executeAllAbortControllers();
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
            // https://github.com/unjs/ofetch/issues/224
            onResponse(ctx) {
              Object.assign(context, ctx);
            },
          });
        } catch (error) {
          if (error instanceof FetchError) {
            console.error(error);
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

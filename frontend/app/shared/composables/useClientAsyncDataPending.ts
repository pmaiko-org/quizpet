import { useMounted } from "@vueuse/core";
import type { AsyncDataRequestStatus } from "nuxt/app";
import type { Ref } from "vue";

export const useClientAsyncDataPending = (
  status: Readonly<Ref<AsyncDataRequestStatus>>,
) => {
  const mounted = useMounted();

  return computed(
    () =>
      !mounted.value || status.value === "idle" || status.value === "pending",
  );
};

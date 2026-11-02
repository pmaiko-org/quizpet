import { useBroadcastChannel } from "@vueuse/core";

export type TAuthSyncMessage =
  | { type: "refreshed"; at: number } |
  { type: "logout"; at: number };

export const useAuthBroadcast = () => {
  const { data, post } = useBroadcastChannel<
    TAuthSyncMessage | undefined,
    TAuthSyncMessage
  >({ name: "quizpet-auth" });

  return { message: data, post };
};

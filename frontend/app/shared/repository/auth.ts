import type { TApiFetch, TRequestOptions } from "~/shared/repository/types";
import type {
  ISessionResponse,
  ISuccessResponse,
} from "~/shared/types/api.generated";

export const authRepository = (backendApi: TApiFetch) => ({
  getSessions: (options?: TRequestOptions) =>
    backendApi<ISessionResponse[]>("/auth/sessions", { ...options }),

  revokeSession: (sessionId: string, options?: TRequestOptions) =>
    backendApi<ISuccessResponse>(`/auth/sessions/${sessionId}`, {
      method: "DELETE",
      ...options,
    }),

  revokeOtherSessions: (options?: TRequestOptions) =>
    backendApi<ISuccessResponse>("/auth/sessions/others", {
      method: "DELETE",
      ...options,
    }),
});

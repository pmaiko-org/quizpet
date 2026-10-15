import type { TApiFetch, TRequestOptions } from "~/shared/repository/types";
import type {
  IFileResponse,
  ISuccessResponse,
} from "~/shared/types/api.generated";

export const storageFilesRepository = (backendApi: TApiFetch) => {
  return {
    upload: (file: File, options?: TRequestOptions) => {
      const formData = new FormData();
      formData.append("file", file);

      return backendApi<IFileResponse>("/storage/upload", {
        method: "POST",
        body: formData,
        ...options,
      });
    },

    getFiles: (options?: TRequestOptions) => {
      return backendApi<IFileResponse[]>("/storage/files", {
        method: "GET",
        ...options,
      });
    },

    deleteFile: (id: string, options?: TRequestOptions) => {
      return backendApi<ISuccessResponse>(`/storage/files/${id}`, {
        method: "DELETE",
        ...options,
      });
    },
  };
};

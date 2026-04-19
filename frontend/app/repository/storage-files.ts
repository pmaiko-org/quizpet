import type { $Fetch, NitroFetchRequest } from "nitropack";
import type { IFileResponse, ISuccessResponse } from "~/types/api.generated";

export const storageFilesRepository = <T>(
  fetch: $Fetch<T, NitroFetchRequest>,
) => {
  return {
    upload: (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      return fetch<IFileResponse>("/backend/storage/upload", {
        method: "POST",
        body: formData,
      });
    },

    getFiles: () => {
      return fetch<IFileResponse[]>("/backend/storage/files", {
        method: "GET",
      });
    },

    deleteFile: (id: string) => {
      return fetch<ISuccessResponse>(`/backend/storage/files/${id}`, {
        method: "DELETE",
      });
    },
  };
};

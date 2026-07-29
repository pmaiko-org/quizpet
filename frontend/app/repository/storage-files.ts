import type { $Fetch, NitroFetchRequest } from "nitropack";

import type { TRequestOptions } from "~/repository/types";
import type { IFileResponse, ISuccessResponse } from "~/types/api.generated";

export const storageFilesRepository = <T>(
  fetch: $Fetch<T, NitroFetchRequest>,
) => {
  return {
    upload: (file: File, options?: TRequestOptions) => {
      const formData = new FormData();
      formData.append("file", file);

      return fetch<IFileResponse>("/backend/storage/upload", {
        method: "POST",
        body: formData,
        ...options,
      });
    },

    getFiles: (options?: TRequestOptions) => {
      return fetch<IFileResponse[]>("/backend/storage/files", {
        method: "GET",
        ...options,
      });
    },

    deleteFile: (id: string, options?: TRequestOptions) => {
      return fetch<ISuccessResponse>(`/backend/storage/files/${id}`, {
        method: "DELETE",
        ...options,
      });
    },
  };
};

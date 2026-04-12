import { z } from "zod";
import type { $Fetch, NitroFetchRequest } from "nitropack";

export interface IStorageFile {
  id: string;
  src: string;
  name: string;
}

export const storageFileSchema = z.object({
  id: z.string(),
  src: z.string(),
  name: z.string(),
})

export const storageFilesRepository = <T>(fetch: $Fetch<T, NitroFetchRequest>) => {
  return {
    upload: (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      return fetch<IStorageFile>("/backend/storage/upload", {
        method: "POST",
        body: formData,
      });
    },

    getFiles: () => {
      return fetch<IStorageFile[]>("/backend/storage/files", {
        method: "GET",
      });
    },

    deleteFile: (id: string) => {
      return fetch<{ success: boolean }>(`/backend/storage/files/${id}`, {
        method: "DELETE",
      });
    },
  };
};

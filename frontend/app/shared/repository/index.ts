import type { $Fetch, NitroFetchRequest } from "nitropack";

import { profileRepository } from "~/shared/repository/profile";
import { setsRepository } from "~/shared/repository/sets";
import { storageFilesRepository } from "~/shared/repository/storage-files";
import { usersRepository } from "~/shared/repository/users";

export const createRepository = <T>(fetch: $Fetch<T, NitroFetchRequest>) => {
  return {
    profile: profileRepository(fetch),
    sets: setsRepository(fetch),
    storageFiles: storageFilesRepository(fetch),
    users: usersRepository(fetch),
  };
};

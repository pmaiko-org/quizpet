import type { $Fetch, NitroFetchRequest } from "nitropack";

import { profileRepository } from "~/repository/profile";
import { setsRepository } from "~/repository/sets";
import { storageFilesRepository } from "~/repository/storage-files";
import { usersRepository } from "~/repository/users";

export const createRepository = <T>(fetch: $Fetch<T, NitroFetchRequest>) => {
  return {
    profile: profileRepository(fetch),
    sets: setsRepository(fetch),
    storageFiles: storageFilesRepository(fetch),
    users: usersRepository(fetch),
  };
};

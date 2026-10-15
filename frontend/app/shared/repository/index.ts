import { cmsRepository } from "~/shared/repository/cms";
import { profileRepository } from "~/shared/repository/profile";
import { setsRepository } from "~/shared/repository/sets";
import { storageFilesRepository } from "~/shared/repository/storage-files";
import type { TApiFetch } from "~/shared/repository/types";
import { usersRepository } from "~/shared/repository/users";

export const createRepository = (backendApi: TApiFetch, cmsApi: TApiFetch) => {
  return {
    cms: cmsRepository(cmsApi),
    profile: profileRepository(backendApi),
    sets: setsRepository(backendApi),
    storageFiles: storageFilesRepository(backendApi),
    users: usersRepository(backendApi),
  };
};

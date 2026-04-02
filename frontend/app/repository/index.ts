import { profileRepository } from "~/repository/profile";
import type { $Fetch, NitroFetchRequest } from "nitropack";

export const createRepository = <T>(fetch: $Fetch<T, NitroFetchRequest>) => {
  return {
    profile: profileRepository(fetch),
  }
}
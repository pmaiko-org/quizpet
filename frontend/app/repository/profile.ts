import type { $Fetch, NitroFetchRequest } from 'nitropack'

export const profileRepository = <T>(fetch: $Fetch<T, NitroFetchRequest>) => {
  return {
    getProfile: () => {
      return fetch('/backend/users/me')
    },
  }
}
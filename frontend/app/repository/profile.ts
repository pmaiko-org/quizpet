import type { $Fetch, NitroFetchRequest } from 'nitropack'

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
}

export const profileRepository = <T>(fetch: $Fetch<T, NitroFetchRequest>) => {
  return {
    getProfile: () => {
      return fetch<IUser>('/backend/users/me')
    },
  }
}
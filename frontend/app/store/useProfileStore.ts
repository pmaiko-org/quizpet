import type { IUser } from "~/repository/profile";

export const useProfileStore = () => {
  const { $repository } = useNuxtApp()
  const state = useState('profileStore', () => ({
    profile: null as null | IUser,
  }))

  const getProfile = async () => {
    const response = await $repository.profile.getProfile()
    state.value.profile = response
  }

  return {
    ...toComputedStateRefs(state),
    getProfile,
  } as const
}

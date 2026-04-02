export const useProfileStore = () => {
  const { $repository } = useNuxtApp()
  const state = useState('profileStore', () => ({
    profile: null as never,
  }))

  const getProfile = async () => {
    await $repository.profile.getProfile()
  }

  return {
    ...toComputedStateRefs(state),
    getProfile,
  } as const
}

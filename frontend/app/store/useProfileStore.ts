export const useProfileStore = () => {
  const { $repository } = useNuxtApp()
  const state = useState('profileStore', () => ({
    profile: null as never,
  }))

  const getProfile = () => {
    const response = $repository.profile.getProfile()
    console.log(response);
  }

  return {
    ...toRefs(state.value),
    getProfile,
  } as const
}

export default defineNuxtPlugin(() => {
  const { isLoggedIn } = useAuthStore()
  const { getProfile } = useProfileStore()

  if (import.meta.client) {
    if (isLoggedIn.value) {
      getProfile()
      getProfile()
      getProfile()
      getProfile()
      getProfile()
      getProfile()
      getProfile()
      getProfile()
      getProfile()
      getProfile()
      getProfile()
      getProfile()
    }
  }

  return {

  }
})
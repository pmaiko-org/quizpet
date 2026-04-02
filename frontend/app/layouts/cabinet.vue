<template>
  <div class="flex min-h-screen">
    <AppSidebar />

    <div class="flex-1 transition-all duration-1300">
      <AppHeader />
      <UContainer class="py-4">
        <UMain>
          <slot />
        </UMain>
      </UContainer>
      <AppFooter />
    </div>
  </div>
</template>

<script setup lang="ts">
const { isLoggedIn } = useAuthStore()
const { getProfile } = useProfileStore()

onMounted(() => {
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
})
</script>

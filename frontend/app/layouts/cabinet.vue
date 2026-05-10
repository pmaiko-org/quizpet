<template>
  <div class="flex flex-1">
    <AppSidebar v-model="open" />

    <div class="flex flex-1 flex-col overflow-hidden bg-default">
      <AppHeader v-model="open" />

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
const { isLoggedIn } = useAuthStore();
const { getProfile } = useProfileStore();

const open = ref(true);

onMounted(async () => {
  if (isLoggedIn.value) {
    await getProfile();
  }
});
</script>

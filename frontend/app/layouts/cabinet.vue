<template>
  <div class="flex min-h-dvh">
    <AppSidebar />

    <div class="flex-1">
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
</script>

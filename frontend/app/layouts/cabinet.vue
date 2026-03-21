<template>
  <div class="flex min-h-lvh">
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
</script>

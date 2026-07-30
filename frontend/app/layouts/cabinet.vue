<template>
  <div class="flex min-h-screen flex-1 bg-default">
    <TheSidebar v-model="open" />

    <div class="flex min-w-0 flex-1 flex-col bg-default">
      <TheHeader v-model="open" />

      <UContainer
        class="
          min-w-0 flex-1 py-5
          sm:py-6
        "
      >
        <UMain class="app-reveal min-h-0 min-w-0">
          <slot />
        </UMain>
      </UContainer>
      <TheFooter />
    </div>
  </div>
</template>

<script setup lang="ts">
useCurrentUser();

const open = ref(true);
</script>

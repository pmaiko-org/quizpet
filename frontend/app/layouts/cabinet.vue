<template>
  <div class="flex min-h-screen flex-1 bg-default">
    <AppSidebar
      v-if="!isLearning"
      v-model="open"
    />

    <div class="flex min-w-0 flex-1 flex-col bg-default">
      <AppHeader
        v-model="open"
        :showSidebarToggle="!isLearning"
      />

      <UContainer
        class="min-w-0 flex-1"
        :class="
          isLearning
            ? `
              max-w-5xl py-4
              sm:py-5
            `
            : `
              py-5
              sm:py-6
            `
        "
      >
        <UMain class="app-reveal min-h-0 min-w-0">
          <slot />
        </UMain>
      </UContainer>
      <AppFooter v-if="!isLearning" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { PageName } from "~/constants";

useCurrentUser();

const route = useRoute();
const open = ref(true);
const isLearning = computed(() => route.name === PageName.SETS_ID_LEARN);
</script>

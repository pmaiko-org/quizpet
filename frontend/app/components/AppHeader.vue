<template>
  <UHeader :toggle="false">
    <template #left>
      <UButton
        v-if="!sidebarVisible"
        icon="i-lucide-menu"
        variant="outline"
        class="cursor-pointer"
        @click="openSidebar"
      />

      <NuxtLink to="/" class="text-2xl font-bold">QuizPet</NuxtLink>
    </template>
  </UHeader>
</template>

<script setup lang="ts">
const { sidebarVisible, openSidebar } = useUiStore();
</script>

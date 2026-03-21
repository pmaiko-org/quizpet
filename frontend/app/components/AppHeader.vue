<template>
  <UHeader :toggle="false">
    <template #left>
      <UButton
        icon="i-lucide-menu"
        variant="outline"
        class="cursor-pointer"
        @click="toggleSidebar"
      />

      <NuxtLink to="/" class="text-2xl font-bold">QuizPet</NuxtLink>
    </template>
  </UHeader>
</template>

<script setup lang="ts">
const { toggleSidebar } = useUiStore();
</script>

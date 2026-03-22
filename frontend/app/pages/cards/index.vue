<template>
  <div>
    <h1 class="text-3xl font-bold mb-4">Картки</h1>

    <UButton
      to="/cards/create"
      icon="i-lucide-plus"
      size="md"
      color="primary"
      variant="solid"
      class="cursor-pointer"
    >
      Створити
    </UButton>
  </div>
</template>
<script setup lang="ts">
definePageMeta({
  layout: "cabinet",
});
</script>

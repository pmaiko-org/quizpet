<template>
  <AppPlaceholderPage
    eyebrow="Hover Map"
    title="Цей експериментальний екран поки без наповнення"
    description="Маршрут залишено для подальших візуальних або UX-експериментів. Поки що зручніше повернутися до основних робочих сторінок."
    primaryTo="/sets"
    primaryLabel="Перейти до карток"
    primaryIcon="i-lucide-sparkles"
    secondaryTo="/"
    secondaryLabel="На головну"
  />
</template>

<script setup lang="ts">
definePageMeta({
  layout: "cabinet",
});

useHead({
  title: "Hover Map | QuizPet",
});
</script>

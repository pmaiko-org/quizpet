<template>
  <BasePlaceholderPage
    eyebrow="Hover Map"
    title="Цей експериментальний екран поки без наповнення"
    description="Маршрут залишено для подальших візуальних або UX-експериментів. Поки що зручніше повернутися до основних робочих сторінок."
    :primaryTo="{ name: RouteName.SETS }"
    primaryLabel="Перейти до карток"
    primaryIcon="i-lucide-sparkles"
    :secondaryTo="{ name: RouteName.INDEX }"
    secondaryLabel="На головну"
  />
</template>

<script setup lang="ts">
import { RouteName } from "~/constants";

definePageMeta({
  layout: "cabinet",
});

useHead({
  title: "Hover Map | QuizPet",
});
</script>

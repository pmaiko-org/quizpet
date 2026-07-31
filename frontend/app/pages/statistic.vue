<template>
  <BasePlaceholderPage
    eyebrow="Статистика"
    title="Розділ статистики готується"
    description="Тут з’явиться огляд прогресу, складних карток і динаміки повторень, не виходячи з основного кабінету."
    :primaryTo="{ name: RouteName.SETS }"
    primaryLabel="Повернутися до карток"
    primaryIcon="i-lucide-bar-chart-3"
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
  title: "Статистика | QuizPet",
});
</script>

<template>
  <BasePlaceholderPage
    eyebrow="Папки"
    title="Розділ папок ще в роботі"
    description="Тут з’явиться структура для групування наборів, щоб можна було швидше перемикатися між темами й сценаріями навчання."
    primaryTo="/sets"
    primaryLabel="Перейти до наборів"
    primaryIcon="i-lucide-folder-open"
    secondaryTo="/"
    secondaryLabel="На головну"
  />
</template>

<script setup lang="ts">
definePageMeta({
  layout: "cabinet",
});

useHead({
  title: "Папки | QuizPet",
});
</script>

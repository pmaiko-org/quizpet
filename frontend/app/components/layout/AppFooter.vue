<template>
  <footer class="border-t border-default p-4 text-xs text-muted">
    <UContainer
      class="
        flex flex-col gap-2
        sm:flex-row sm:items-center sm:justify-between
      "
    >
      <p>QuizPet © {{ new Date().getFullYear() }}</p>
      <p>Маленькі кроки, сильна пам’ять.</p>
    </UContainer>
  </footer>
</template>

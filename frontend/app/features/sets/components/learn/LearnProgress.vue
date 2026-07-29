<template>
  <section class="app-surface p-3">
    <div
      class="
        flex flex-col gap-2.5
        sm:flex-row sm:items-center sm:justify-between
      "
    >
      <div class="min-w-0">
        <p class="text-xs font-medium text-muted">
          Навчальний сеанс
        </p>
        <h1 class="mt-0.5 text-lg font-semibold text-highlighted">
          {{ title }}
        </h1>
      </div>

      <div
        class="
          app-radius-control grid shrink-0 grid-cols-3 divide-x divide-default
          overflow-hidden border border-default bg-muted/35
        "
      >
        <div
          v-for="stat in stats"
          :key="stat.label"
          class="min-w-20 px-2.5 py-1.5"
        >
          <p
            class="
              truncate text-[9px] font-semibold tracking-normal text-muted
              uppercase
            "
          >
            {{ stat.label }}
          </p>
          <p class="mt-0.5 text-sm font-semibold text-highlighted">
            {{ stat.value }}
          </p>
        </div>
      </div>
    </div>

    <div class="mt-3 h-2 overflow-hidden rounded-full bg-muted">
      <div
        class="h-full rounded-full bg-primary transition-[width] duration-300"
        :style="{ width: `${learnedPercent}%` }"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
const {
  learnedCount,
  totalCards,
  currentStep,
  queueLength,
  mistakesCount,
  totalTime,
} = defineProps<{
  learnedCount: number;
  totalCards: number;
  currentStep: number;
  queueLength: number;
  mistakesCount: number;
  totalTime: string;
}>();

const title = computed(() => {
  if (!totalCards) {
    return "Немає карток для проходження";
  }

  return `Крок ${Math.min(currentStep + 1, queueLength)} з ${queueLength}`;
});

const learnedPercent = computed(() => {
  if (!totalCards) {
    return 0;
  }

  return Math.min(100, Math.round((learnedCount / totalCards) * 100));
});

const stats = computed(() => [
  {
    label: "Засвоєно",
    value: `${learnedCount}/${totalCards}`,
  },
  {
    label: "Повтори",
    value: mistakesCount,
  },
  {
    label: "Сеанс",
    value: totalTime,
  },
]);
</script>

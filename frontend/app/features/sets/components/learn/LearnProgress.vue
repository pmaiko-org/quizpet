<template>
  <section class="rounded-md bg-elevated/70 px-3 py-2">
    <div class="flex flex-row items-center justify-between gap-1.5">
      <div class="flex min-w-0 items-baseline gap-2">
        <h1 class="truncate text-sm font-semibold text-toned">
          {{ title }}
        </h1>
      </div>

      <div class="flex shrink-0 items-center gap-1">
        <div
          v-for="stat in stats"
          :key="stat.label"
          class="min-w-16 rounded-sm px-2 py-0.5 text-center"
          :class="stat.pulseClass"
        >
          <p
            class="
              truncate text-[9px] font-semibold tracking-normal text-dimmed
              uppercase
            "
          >
            {{ stat.label }}
          </p>
          <p class="text-xs font-semibold text-toned">
            {{ stat.value }}
          </p>
        </div>
      </div>
    </div>

    <div class="mt-1 h-1 overflow-hidden rounded-full bg-muted/60">
      <div
        class="
          h-full rounded-full bg-primary/80 transition-[width] duration-300
        "
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

const knownPulse = ref(false);
const repeatPulse = ref(false);
let knownTimer: ReturnType<typeof setTimeout> | null = null;
let repeatTimer: ReturnType<typeof setTimeout> | null = null;

watch(
  () => learnedCount,
  (next, prev) => {
    if (next <= prev) {
      return;
    }

    knownPulse.value = true;

    if (knownTimer) {
      clearTimeout(knownTimer);
    }

    knownTimer = setTimeout(() => {
      knownPulse.value = false;
    }, 600);
  },
);

watch(
  () => mistakesCount,
  (next, prev) => {
    if (next <= prev) {
      return;
    }

    repeatPulse.value = true;

    if (repeatTimer) {
      clearTimeout(repeatTimer);
    }

    repeatTimer = setTimeout(() => {
      repeatPulse.value = false;
    }, 600);
  },
);

onBeforeUnmount(() => {
  if (knownTimer) {
    clearTimeout(knownTimer);
  }

  if (repeatTimer) {
    clearTimeout(repeatTimer);
  }
});

const stats = computed(() => [
  {
    label: "Засвоєно",
    value: `${learnedCount}/${totalCards}`,
    pulseClass: knownPulse.value ? "learn-stat-pulse-known" : "",
  },
  {
    label: "Повтори",
    value: mistakesCount,
    pulseClass: repeatPulse.value ? "learn-stat-pulse-missed" : "",
  },
  {
    label: "Сеанс",
    value: totalTime,
    pulseClass: "",
  },
]);
</script>

<style scoped>
.learn-stat-pulse-known {
  animation: learn-stat-known 600ms ease;
}

.learn-stat-pulse-missed {
  animation: learn-stat-missed 600ms ease;
}

@keyframes learn-stat-known {
  0% {
    background-color: rgba(16, 185, 129, 0);
  }

  30% {
    background-color: rgba(16, 185, 129, 0.28);
  }

  100% {
    background-color: rgba(16, 185, 129, 0);
  }
}

@keyframes learn-stat-missed {
  0% {
    background-color: rgba(245, 158, 11, 0);
  }

  30% {
    background-color: rgba(245, 158, 11, 0.28);
  }

  100% {
    background-color: rgba(245, 158, 11, 0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .learn-stat-pulse-known,
  .learn-stat-pulse-missed {
    animation: none;
  }
}
</style>

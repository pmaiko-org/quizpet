<template>
  <section
    class="
      rounded-4xl border border-default bg-default/85 p-5 shadow-sm
      sm:p-6
    "
  >
    <div class="flex flex-col gap-5">
      <div
        class="
          flex flex-col gap-3
          lg:flex-row lg:items-start lg:justify-between
        "
      >
        <div class="space-y-2">
          <p
            class="text-sm font-medium tracking-[0.24em] text-primary uppercase"
          >
            Прогрес навчання
          </p>
          <h2 class="text-2xl font-semibold text-highlighted">
            {{ title }}
          </h2>
          <p class="max-w-2xl text-sm/6 text-toned">
            {{ description }}
          </p>
        </div>

        <div
          class="
            grid gap-2
            sm:grid-cols-2
            xl:grid-cols-4
          "
        >
          <div
            v-for="stat in stats"
            :key="stat.label"
            class="rounded-2xl border border-default bg-default/70 px-4 py-3"
          >
            <p class="text-xs tracking-[0.18em] text-toned uppercase">
              {{ stat.label }}
            </p>
            <p class="mt-1 text-lg font-semibold text-highlighted">
              {{ stat.value }}
            </p>
          </div>
        </div>
      </div>

      <div class="space-y-3">
        <div class="flex items-center justify-between gap-3 text-sm">
          <span class="text-toned">Засвоєно</span>
          <span class="font-medium text-highlighted">
            {{ learnedCount }} / {{ totalCards }}
          </span>
        </div>

        <div class="h-3 overflow-hidden rounded-full bg-muted/60">
          <div
            class="h-full rounded-full bg-primary transition-all duration-300"
            :style="{ width: `${learnedPercent}%` }"
          />
        </div>
      </div>

      <div class="space-y-3">
        <div class="flex items-center justify-between gap-3 text-sm">
          <span class="text-toned">Повторення після помилок</span>
          <span class="font-medium text-highlighted">
            {{ mistakesCount }}
          </span>
        </div>

        <div class="h-3 overflow-hidden rounded-full bg-muted/60">
          <div
            class="h-full rounded-full bg-error/70 transition-all duration-300"
            :style="{ width: `${mistakesPercent}%` }"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const props = defineProps<{
  learnedCount: number;
  totalCards: number;
  currentStep: number;
  queueLength: number;
  mistakesCount: number;
  currentCardTime: string;
  totalTime: string;
}>();

const title = computed(() => {
  if (!props.totalCards) {
    return "Немає карток для проходження";
  }

  return `Крок ${Math.min(props.currentStep + 1, props.queueLength)} з ${props.queueLength}`;
});

const description = computed(() => {
  if (!props.totalCards) {
    return "Додайте щонайменше дві картки в набір, щоб почати навчання.";
  }

  if (!props.mistakesCount) {
    return "Поки йдете без помилок. За потреби перевертайте картку, щоб звірити відповідь.";
  }

  return `${props.mistakesCount} картки вже повернуться в повторення. Це нормально: так набір краще закріплюється.`;
});

const learnedPercent = computed(() => {
  if (!props.totalCards) {
    return 0;
  }

  return Math.min(
    100,
    Math.round((props.learnedCount / props.totalCards) * 100),
  );
});

const mistakesPercent = computed(() => {
  if (!props.totalCards) {
    return 0;
  }

  return Math.min(
    100,
    Math.round((props.mistakesCount / props.totalCards) * 100),
  );
});

const stats = computed(() => {
  return [
    {
      label: "У черзі",
      value: props.queueLength,
    },
    {
      label: "Помилок",
      value: props.mistakesCount,
    },
    {
      label: "Ця картка",
      value: props.currentCardTime,
    },
    {
      label: "Весь сеанс",
      value: props.totalTime,
    },
  ];
});
</script>

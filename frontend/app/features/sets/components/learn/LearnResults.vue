<template>
  <section class="space-y-6">
    <section
      class="
        app-radius-surface overflow-hidden border border-default bg-linear-to-br
        from-primary/10 via-elevated to-elevated p-6 shadow-sm
        md:p-8
      "
    >
      <div
        class="
          grid gap-6
          lg:grid-cols-[minmax(0,1.15fr)_minmax(22rem,0.85fr)] lg:items-center
        "
      >
        <div class="space-y-4">
          <p
            class="text-sm font-medium tracking-[0.24em] text-primary uppercase"
          >
            Результати
          </p>
          <h2
            class="
              text-3xl font-semibold text-highlighted
              md:text-4xl
            "
          >
            {{ heading }}
          </h2>
          <p
            class="
              max-w-2xl text-sm/6 text-toned
              md:text-base
            "
          >
            {{ summary }}
          </p>

          <div
            class="
              flex flex-col gap-3
              sm:flex-row
            "
          >
            <UButton
              size="xl"
              icon="i-lucide-rotate-ccw"
              class="justify-center"
              @click="$emit('restart')"
            >
              Пройти ще раз
            </UButton>

            <UButton
              size="xl"
              variant="outline"
              color="neutral"
              icon="i-lucide-target"
              class="justify-center"
              :disabled="mistakeCards.length === 0"
              @click="$emit('retryMistakes')"
            >
              Повторити лише складні
            </UButton>
          </div>
        </div>

        <AppMetricGrid
          :items="stats"
          variant="summary"
          columns="two"
        />
      </div>
    </section>

    <section
      class="
        app-radius-surface border border-default bg-default/85 p-5 shadow-sm
        md:p-6
      "
    >
      <div
        class="
          flex flex-col gap-2
          md:flex-row md:items-end md:justify-between
        "
      >
        <div>
          <p
            class="text-sm font-medium tracking-[0.24em] text-primary uppercase"
          >
            Розбір карток
          </p>
          <h3 class="mt-1 text-2xl font-semibold text-highlighted">
            Де було легко, а де варто ще пройтись
          </h3>
        </div>

        <p class="text-sm text-toned">
          {{ reports.length }} карток у підсумку
        </p>
      </div>

      <div class="mt-5 space-y-3">
        <article
          v-for="report in orderedReports"
          :key="report.card.id"
          class="app-radius-surface border p-4"
          :class="
            report.mistakes
              ? 'border-error/20 bg-error/5'
              : 'border-primary/15 bg-primary/5'
          "
        >
          <div
            class="
              flex flex-col gap-4
              lg:flex-row lg:items-start lg:justify-between
            "
          >
            <div class="space-y-3">
              <div class="flex flex-wrap items-center gap-2">
                <h4 class="text-lg font-semibold text-highlighted">
                  {{ report.card.term }}
                </h4>

                <UBadge
                  :color="report.mistakes ? 'error' : 'primary'"
                  variant="soft"
                  size="md"
                  class="app-radius-control"
                >
                  {{
                    report.mistakes
                      ? `Було помилок: ${report.mistakes}`
                      : "Без помилок"
                  }}
                </UBadge>
              </div>

              <p class="max-w-3xl text-sm/6 text-toned">
                {{ report.card.definition }}
              </p>
            </div>

            <div
              class="
                grid grid-cols-3 gap-2
                lg:min-w-88
              "
            >
              <div
                class="
                  app-radius-surface border border-default bg-default/70 p-3
                "
              >
                <p class="text-xs tracking-[0.16em] text-toned uppercase">
                  Спроб
                </p>
                <p class="mt-1 text-lg font-semibold text-highlighted">
                  {{ report.attempts.length }}
                </p>
              </div>

              <div
                class="
                  app-radius-surface border border-default bg-default/70 p-3
                "
              >
                <p class="text-xs tracking-[0.16em] text-toned uppercase">
                  Час
                </p>
                <p class="mt-1 text-lg font-semibold text-highlighted">
                  {{ formatDuration(report.totalDurationMs) }}
                </p>
              </div>

              <div
                class="
                  app-radius-surface border border-default bg-default/70 p-3
                "
              >
                <p class="text-xs tracking-[0.16em] text-toned uppercase">
                  Середнє
                </p>
                <p class="mt-1 text-lg font-semibold text-highlighted">
                  {{ formatDuration(report.averageDurationMs) }}
                </p>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  </section>
</template>

<script setup lang="ts">
import {
  formatDuration,
  getAccuracy,
  type ILearningCardReport,
} from "../../utils";

const { reports, totalDurationMs } = defineProps<{
  reports: ILearningCardReport[];
  totalDurationMs: number;
}>();

defineEmits<{
  restart: [];
  retryMistakes: [];
}>();

const mistakeCards = computed(() => {
  return reports.filter(report => report.mistakes > 0);
});

const knownFirstTry = computed(() => {
  return reports.filter(report => report.firstTryKnown).length;
});

const accuracy = computed(() => {
  return getAccuracy(reports);
});

const averageTime = computed(() => {
  if (!reports.length) {
    return 0;
  }

  return totalDurationMs / reports.length;
});

const heading = computed(() => {
  if (!reports.length) {
    return "Підсумок з'явиться після проходження";
  }

  if (!mistakeCards.value.length) {
    return "Ідеальний прохід без помилок";
  }

  return "Сеанс завершено, є що закріпити";
});

const summary = computed(() => {
  if (!reports.length) {
    return "Додайте картки в набір і поверніться до режиму навчання.";
  }

  if (!mistakeCards.value.length) {
    return "Усі картки були закриті без промахів. Можна або піти далі, або пройти набір ще раз для закріплення темпу.";
  }

  return `${mistakeCards.value.length} картки потребували повторення. У блоці нижче видно, де саме були затримки та як багато спроб знадобилося.`;
});

const stats = computed(() => {
  return [
    {
      label: "Точність",
      value: `${accuracy.value}%`,
    },
    {
      label: "З першого разу",
      value: knownFirstTry.value,
    },
    {
      label: "Загальний час",
      value: formatDuration(totalDurationMs),
    },
    {
      label: "Середній час",
      value: formatDuration(averageTime.value),
    },
  ];
});

const orderedReports = computed(() => {
  return [...reports].sort((left, right) => {
    if (right.mistakes !== left.mistakes) {
      return right.mistakes - left.mistakes;
    }

    return right.totalDurationMs - left.totalDurationMs;
  });
});
</script>

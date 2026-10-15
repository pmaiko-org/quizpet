<template>
  <section class="space-y-6">
    <section
      class="
        overflow-hidden rounded-md border border-default bg-linear-to-br
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
            {{ $t("learn.results.eyebrow") }}
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
              @click="emit('restart')"
            >
              {{ $t("learn.results.restart") }}
            </UButton>

            <UButton
              size="xl"
              variant="outline"
              color="neutral"
              icon="i-lucide-target"
              class="justify-center"
              :disabled="mistakeCards.length === 0"
              @click="emit('retryMistakes')"
            >
              {{ $t("learn.results.retryMistakes") }}
            </UButton>
          </div>
        </div>

        <BaseMetricGrid
          :items="stats"
          variant="summary"
          columns="two"
        />
      </div>
    </section>

    <section
      class="
        rounded-md border border-default bg-default/85 p-5 shadow-sm
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
            {{ $t("learn.results.reviewEyebrow") }}
          </p>
          <h3 class="mt-1 text-2xl font-semibold text-highlighted">
            {{ $t("learn.results.reviewTitle") }}
          </h3>
        </div>

        <p class="text-sm text-toned">
          {{
            $t(
              "learn.results.cardCount",
              { count: reports.length },
              reports.length,
            )
          }}
        </p>
      </div>

      <div class="mt-5 space-y-3">
        <article
          v-for="report in orderedReports"
          :key="report.card.id"
          class="rounded-md border p-4"
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
                  class="rounded-sm"
                >
                  {{
                    report.mistakes
                      ? $t("learn.results.mistakes", { count: report.mistakes })
                      : $t("learn.results.noMistakes")
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
              <div class="rounded-md border border-default bg-default/70 p-3">
                <p class="text-xs tracking-[0.16em] text-toned uppercase">
                  {{ $t("learn.results.attempts") }}
                </p>
                <p class="mt-1 text-lg font-semibold text-highlighted">
                  {{ report.attempts.length }}
                </p>
              </div>

              <div class="rounded-md border border-default bg-default/70 p-3">
                <p class="text-xs tracking-[0.16em] text-toned uppercase">
                  {{ $t("learn.results.time") }}
                </p>
                <p class="mt-1 text-lg font-semibold text-highlighted">
                  {{ formatDuration(report.totalDurationMs) }}
                </p>
              </div>

              <div class="rounded-md border border-default bg-default/70 p-3">
                <p class="text-xs tracking-[0.16em] text-toned uppercase">
                  {{ $t("learn.results.average") }}
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

const { t } = useI18n();

const emit = defineEmits<{
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
    return t("learn.results.headingEmpty");
  }

  if (!mistakeCards.value.length) {
    return t("learn.results.headingPerfect");
  }

  return t("learn.results.headingReview");
});

const summary = computed(() => {
  if (!reports.length) {
    return t("learn.results.summaryEmpty");
  }

  if (!mistakeCards.value.length) {
    return t("learn.results.summaryPerfect");
  }

  return t(
    "learn.results.summaryReview",
    { count: mistakeCards.value.length },
    mistakeCards.value.length,
  );
});

const stats = computed(() => {
  return [
    {
      label: t("learn.results.accuracy"),
      value: `${accuracy.value}%`,
    },
    {
      label: t("learn.results.firstTry"),
      value: knownFirstTry.value,
    },
    {
      label: t("learn.results.totalTime"),
      value: formatDuration(totalDurationMs),
    },
    {
      label: t("learn.results.averageTime"),
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

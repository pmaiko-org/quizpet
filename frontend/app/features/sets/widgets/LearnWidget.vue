<template>
  <BaseDataBoundary
    :pending="loading"
    :error="error"
    :empty="!cards.length"
    errorTitle="Не вдалося завантажити набір"
    errorDescription="Спробуйте оновити сторінку або повторно звернутися до сервера."
    retryLabel="Спробувати ще раз"
    @retry="refreshSet"
  >
    <template #loading>
      <LearnSessionSkeleton />
    </template>

    <template #empty>
      <section
        class="
          rounded-md border border-dashed border-default bg-default/70 p-8
          text-center shadow-sm
        "
      >
        <div
          class="
            mx-auto flex size-14 items-center justify-center rounded-md
            bg-primary/10 text-primary
          "
        >
          <UIcon
            name="i-lucide-layers-3"
            class="size-7"
          />
        </div>
        <h2 class="mt-5 text-2xl font-semibold text-highlighted">
          У наборі поки немає карток
        </h2>
      </section>
    </template>

    <LearnResults
      v-if="isShowingResults"
      :reports="reports"
      :totalDurationMs="totalElapsedMs"
      @restart="restartSession"
      @retry-mistakes="restartMistakes"
    />

    <div
      v-else-if="currentCard"
      ref="learnStage"
      class="flex min-h-0 flex-col gap-3"
      :class="
        isFullscreen
          ? 'h-svh bg-default p-4'
          : `
            h-[calc(100svh-var(--ui-header-height)-2.5rem)]
            sm:h-[calc(100svh-var(--ui-header-height)-3rem)]
          `
      "
    >
      <LearnProgress
        class="shrink-0"
        :learnedCount="learnedCount"
        :totalCards="activeCardIds.length"
        :currentStep="currentStep"
        :queueLength="queue.length"
        :mistakesCount="mistakeCardCount"
        :totalTime="totalTime"
      />

      <div
        class="relative min-h-0 flex-1"
        aria-live="polite"
      >
        <Transition :name="cardTransition">
          <div
            :key="`${currentCard.id}-${currentStep}`"
            class="absolute inset-0"
          >
            <LearnFlashcard
              class="h-full"
              :card="currentCard"
              :currentStep="currentStep + 1"
              :currentCardTime="currentCardTime"
              :flipped="flipped"
              :answering="isAnswering"
              :outcome="lastOutcome"
              :canEdit="canEdit"
              :editLink="currentCardEditLink"
              :fullscreenSupported="fullscreenSupported"
              :isFullscreen="isFullscreen"
              @flip="toggleFlip"
              @known="markKnown"
              @missed="markMissed"
              @toggle-fullscreen="toggleFullscreen"
            />
          </div>
        </Transition>
      </div>

      <LearnControls
        class="shrink-0"
        :locked="isAnswering"
        @known="markKnown"
        @missed="markMissed"
      />
    </div>
  </BaseDataBoundary>
</template>

<script setup lang="ts">
import { useFullscreen } from "@vueuse/core";

const learnStage = ref<HTMLElement | null>(null);
const {
  isFullscreen,
  isSupported: fullscreenSupported,
  toggle: toggleFullscreen,
} = useFullscreen(learnStage);

const { email } = useCurrentUser();

const {
  cards,
  canEdit,
  loading,
  error,
  refreshSet,
  activeCardIds,
  queue,
  currentStep,
  flipped,
  isAnswering,
  lastOutcome,
  currentCard,
  currentCardEditLink,
  isShowingResults,
  totalElapsedMs,
  currentCardTime,
  totalTime,
  reports,
  learnedCount,
  mistakeCardCount,
  toggleFlip,
  markKnown,
  markMissed,
  restartSession,
  restartMistakes,
} = useLearnSession(email);

const cardTransition = computed(() => {
  return lastOutcome.value === "missed" ? "card-missed" : "card-known";
});

const onKeydown = (event: KeyboardEvent) => {
  if (isShowingResults.value || !currentCard.value) {
    return;
  }

  const target = event.target as HTMLElement | null;
  const tag = target?.tagName;

  if (tag === "INPUT" || tag === "TEXTAREA" || target?.isContentEditable) {
    return;
  }

  if (event.key === "ArrowLeft") {
    event.preventDefault();
    markMissed();
  } else if (event.key === "ArrowRight") {
    event.preventDefault();
    markKnown();
  } else if (event.key === " " || event.code === "Space") {
    event.preventDefault();
    toggleFlip();
  }
};

onMounted(() => window.addEventListener("keydown", onKeydown));
onBeforeUnmount(() => window.removeEventListener("keydown", onKeydown));
</script>

<style scoped>
.card-known-enter-active,
.card-missed-enter-active {
  transition:
    transform 280ms cubic-bezier(0.22, 0.61, 0.36, 1),
    opacity 260ms ease;
}

.card-known-leave-active,
.card-missed-leave-active {
  z-index: 10;
  transition:
    transform 320ms cubic-bezier(0.55, 0.06, 0.68, 0.19),
    opacity 320ms ease;
}

.card-known-enter-from,
.card-missed-enter-from {
  opacity: 0;
  transform: translateY(10px) scale(0.955);
}

.card-known-leave-to {
  opacity: 0;
  transform: translateX(118%) rotate(7deg);
}

.card-missed-leave-to {
  opacity: 0;
  transform: translateX(-118%) rotate(-7deg);
}

@media (prefers-reduced-motion: reduce) {
  .card-known-enter-active,
  .card-missed-enter-active,
  .card-known-leave-active,
  .card-missed-leave-active {
    transition: opacity 120ms ease;
  }

  .card-known-enter-from,
  .card-missed-enter-from,
  .card-known-leave-to,
  .card-missed-leave-to {
    transform: none;
  }
}
</style>

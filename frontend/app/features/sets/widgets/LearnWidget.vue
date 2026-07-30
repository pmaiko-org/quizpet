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
          app-radius-surface border border-dashed border-default bg-default/70
          p-8 text-center shadow-sm
        "
      >
        <div
          class="
            app-radius-surface mx-auto flex size-14 items-center justify-center
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
        <p class="mx-auto mt-3 max-w-xl text-sm/6 text-toned">
          Додайте кілька карток у редакторі, і тут одразу з’явиться повноцінний
          режим навчання з повторенням та статистикою.
        </p>
        <UButton
          :to="editSetLink"
          icon="i-lucide-pencil"
          size="xl"
          class="mt-6 justify-center"
        >
          Відкрити редактор
        </UButton>
      </section>
    </template>

    <div v-if="isShowingResults">
      <LearnResults
        :reports="reports"
        :totalDurationMs="totalElapsedMs"
        @restart="restartSession"
        @retry-mistakes="restartMistakes"
      />
    </div>

    <div
      v-else-if="currentCard"
      ref="learnStage"
      class="flex min-h-0 flex-col gap-3 pb-[env(safe-area-inset-bottom)]"
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
        :key="`${currentCard.id}-${currentStep}`"
        class="learn-card-anim min-h-0 flex-1"
        aria-live="polite"
      >
        <LearnFlashcard
          class="h-full"
          :card="currentCard"
          :currentStep="currentStep + 1"
          :currentCardTime="currentCardTime"
          :flipped="flipped"
          :editLink="currentCardEditLink"
          :fullscreenSupported="fullscreenSupported"
          :isFullscreen="isFullscreen"
          @flip="toggleFlip"
          @toggle-fullscreen="toggleFullscreen"
        />
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
const learnStage = ref<HTMLElement | null>(null);
const {
  isFullscreen,
  isSupported: fullscreenSupported,
  toggle: toggleFullscreen,
} = useFullscreen(learnStage);

const {
  cards,
  loading,
  error,
  refreshSet,
  activeCardIds,
  queue,
  currentStep,
  flipped,
  isAnswering,
  editSetLink,
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
} = useLearnSession();

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
.learn-card-anim {
  animation: learn-card-in 180ms ease both;
}

@keyframes learn-card-in {
  from {
    opacity: 0;
    transform: translateX(16px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .learn-card-anim {
    animation: none;
  }
}
</style>

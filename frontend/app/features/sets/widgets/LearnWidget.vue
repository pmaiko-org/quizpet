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

    <div
      class="mx-auto space-y-3"
      :class="isShowingResults ? 'max-w-5xl' : 'max-w-3xl'"
    >
      <template v-if="isShowingResults">
        <LearnResults
          :reports="reports"
          :totalDurationMs="totalElapsedMs"
          @restart="restartSession"
          @retry-mistakes="restartMistakes"
        />
      </template>

      <template v-else-if="currentCard">
        <LearnProgress
          :learnedCount="learnedCount"
          :totalCards="activeCardIds.length"
          :currentStep="currentStep"
          :queueLength="queue.length"
          :mistakesCount="mistakeCardCount"
          :totalTime="totalTime"
        />

        <Transition
          name="learn-card"
          mode="out-in"
        >
          <div
            :key="`${currentCard.id}-${currentStep}`"
            aria-live="polite"
          >
            <LearnFlashcard
              :card="currentCard"
              :currentStep="currentStep + 1"
              :currentCardTime="currentCardTime"
              :flipped="flipped"
              :editLink="currentCardEditLink"
              @flip="toggleFlip"
            />
          </div>
        </Transition>

        <LearnControls
          :locked="isAnswering"
          @known="markKnown"
          @missed="markMissed"
        />
      </template>
    </div>
  </BaseDataBoundary>
</template>

<script setup lang="ts">
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
</script>

<style scoped>
.learn-card-enter-active,
.learn-card-leave-active {
  transition:
    opacity 180ms ease,
    transform 180ms ease;
}

.learn-card-enter-from {
  opacity: 0;
  transform: translateX(16px);
}

.learn-card-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}

@media (prefers-reduced-motion: reduce) {
  .learn-card-enter-active,
  .learn-card-leave-active {
    transition: none;
  }
}
</style>

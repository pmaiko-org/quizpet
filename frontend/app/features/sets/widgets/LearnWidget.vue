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
      <section
        class="
          rounded-4xl border border-default bg-default/85 p-6 shadow-sm
          sm:p-8
        "
      >
        <div class="animate-pulse space-y-4">
          <div class="h-5 w-40 rounded-full bg-muted/60" />
          <div class="h-8 w-3/5 rounded-full bg-muted/60" />
          <div class="h-4 rounded-full bg-muted/60" />
          <div class="h-4 w-5/6 rounded-full bg-muted/60" />
          <div class="mt-6 h-96 rounded-4xl bg-muted/50" />
        </div>
      </section>
    </template>

    <template #empty>
      <section
        class="
          rounded-4xl border border-dashed border-default bg-default/70 p-8
          text-center shadow-sm
        "
      >
        <div
          class="
            mx-auto flex size-14 items-center justify-center rounded-2xl
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

    <div class="space-y-6">
      <template v-if="isShowingResults">
        <LearnResults
          :reports="reports"
          :totalDurationMs="totalElapsedMs"
          @restart="restartSession"
          @retry-mistakes="restartMistakes"
        />
      </template>

      <template v-else-if="currentCard">
        <Transition
          name="slide-left"
          mode="out-in"
        >
          <LearnFlashcard
            :key="currentCard.id"
            :card="currentCard"
            :currentStep="currentStep + 1"
            :currentCardTime="currentCardTime"
            :flipped="flipped"
            :editLink="currentCardEditLink"
            @flip="toggleFlip"
          />
        </Transition>

        <LearnControls
          :locked="isAnswering"
          @known="markKnown"
          @missed="markMissed"
        />

        <LearnProgress
          :learnedCount="learnedCount"
          :totalCards="activeCardIds.length"
          :currentStep="currentStep"
          :queueLength="queue.length"
          :mistakesCount="mistakeCardCount"
          :currentCardTime="currentCardTime"
          :totalTime="totalTime"
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

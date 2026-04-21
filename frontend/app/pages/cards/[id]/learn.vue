<template>
  <div class="space-y-6">
    <section
      v-if="loading"
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

    <section
      v-else-if="error"
      class="
        rounded-4xl border border-error/30 bg-error/5 p-6 shadow-sm
        sm:p-8
      "
    >
      <div
        class="
          flex flex-col gap-4
          sm:flex-row sm:items-center sm:justify-between
        "
      >
        <div class="space-y-2">
          <p class="text-sm font-medium tracking-[0.2em] text-error uppercase">
            Помилка
          </p>
          <h2 class="text-2xl font-semibold text-highlighted">
            Не вдалося завантажити набір
          </h2>
          <p class="max-w-2xl text-sm/6 text-toned">
            Спробуйте оновити сторінку або повторно звернутися до сервера.
          </p>
        </div>

        <UButton
          size="lg"
          color="error"
          variant="soft"
          icon="i-lucide-refresh-cw"
          @click="refreshSet"
        >
          Спробувати ще раз
        </UButton>
      </div>
    </section>

    <section
      v-else-if="!cards.length"
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

    <template v-else-if="isShowingResults">
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
</template>

<script setup lang="ts">
import { useNow } from "@vueuse/core";
import type { LearningAttempt, LearningCardReport } from "~/utils/cardLearning";
import { formatTime } from "~/utils/cardLearning";
import type { ICardDetailsResponse } from "~/types/api.generated";

definePageMeta({
  layout: "cabinet",
});

interface CardSessionState {
  attempts: LearningAttempt[];
  mistakes: number;
  successes: number;
  revealCount: number;
  totalDurationMs: number;
}

const route = useRoute();
const { $repository } = useNuxtApp();

const {
  data: cards,
  status,
  error,
  refresh,
} = await useAsyncData(
  `cards-learning-${route.params.id as string}`,
  () => $repository.cards.getCards(route.params.id as string),
  {
    server: false,
    default: () => [],
  },
);

const loading = computed(
  () => status.value === "pending" || status.value === "idle",
);

const editSetLink = computed(() => {
  return `/cards/${route.params.id as string}/edit`;
});

const currentCardEditLink = computed(() => {
  if (!currentCard.value) {
    return editSetLink.value;
  }

  return `${editSetLink.value}?card=${currentCard.value.id}`;
});

const refreshSet = () => refresh();

const now = useNow({ interval: 250 });

const activeCardIds = ref<string[]>([]);
const queue = ref<string[]>([]);
const currentStep = ref(0);
const flipped = ref(false);
const isAnswering = ref(false);
const sessionStartedAt = ref(0);
const sessionFinishedAt = ref<number | null>(null);
const cardStartedAt = ref(0);
const initialized = ref(false);
const cardStates = reactive<Record<string, CardSessionState>>({});

let advanceTimeout: number | null = null;

const cardMap = computed<Map<string, ICardDetailsResponse>>(() => {
  return new Map(cards.value.map(card => [card.id, card]));
});

const currentCardId = computed<string | null>(() => {
  return queue.value[currentStep.value] ?? null;
});

const currentCard = computed<ICardDetailsResponse | null>(() => {
  if (!currentCardId.value) {
    return null;
  }

  return cardMap.value.get(currentCardId.value) ?? null;
});

const currentCardElapsedMs = computed<number>(() => {
  if (!currentCard.value || !cardStartedAt.value || isShowingResults.value) {
    return 0;
  }

  return Math.max(0, Number(now.value) - cardStartedAt.value);
});

const totalElapsedMs = computed<number>(() => {
  if (!sessionStartedAt.value) {
    return 0;
  }

  const finishAt = sessionFinishedAt.value ?? Number(now.value);

  return Math.max(0, finishAt - sessionStartedAt.value);
});

const currentCardTime = computed<string>(() => {
  return formatTime(currentCardElapsedMs.value);
});

const totalTime = computed<string>(() => {
  return formatTime(totalElapsedMs.value);
});

const reports = computed<LearningCardReport[]>(() => {
  return activeCardIds.value
    .map((cardId) => {
      const card = cardMap.value.get(cardId);
      const state = cardStates[cardId];

      if (!card || !state) {
        return null;
      }

      return {
        card,
        attempts: state.attempts,
        mistakes: state.mistakes,
        successes: state.successes,
        revealCount: state.revealCount,
        totalDurationMs: state.totalDurationMs,
        averageDurationMs: state.attempts.length
          ? state.totalDurationMs / state.attempts.length
          : 0,
        firstTryKnown: state.attempts[0]?.outcome === "known",
      };
    })
    .filter(Boolean) as LearningCardReport[];
});

const learnedCount = computed(() => {
  return reports.value.filter(report => report.successes > 0).length;
});

const mistakeCardCount = computed(() => {
  return reports.value.filter(report => report.mistakes > 0).length;
});

const isShowingResults = computed(() => {
  return sessionFinishedAt.value !== null;
});

const clearAdvanceTimeout = () => {
  if (advanceTimeout !== null) {
    window.clearTimeout(advanceTimeout);
    advanceTimeout = null;
  }
};

const resetCardStates = (cardIds: string[]) => {
  cardIds.forEach((cardId) => {
    cardStates[cardId] = {
      attempts: [],
      mistakes: 0,
      successes: 0,
      revealCount: 0,
      totalDurationMs: 0,
    };
  });
};

const getCardState = (cardId: string) => {
  const state = cardStates[cardId];

  if (!state) {
    throw new Error(`Missing learning state for card ${cardId}`);
  }

  return state;
};

const startSession = (cardIds: string[]) => {
  if (!cardIds.length) {
    return;
  }

  clearAdvanceTimeout();
  resetCardStates(cardIds);

  activeCardIds.value = [...cardIds];
  queue.value = [...cardIds];
  currentStep.value = 0;
  flipped.value = false;
  isAnswering.value = false;
  sessionStartedAt.value = Date.now();
  sessionFinishedAt.value = null;
  cardStartedAt.value = Date.now();
};

const finishSession = () => {
  clearAdvanceTimeout();
  sessionFinishedAt.value = Date.now();
  isAnswering.value = false;
  flipped.value = false;
};

const goToNextCard = () => {
  currentStep.value += 1;
  isAnswering.value = false;
  flipped.value = false;

  if (currentStep.value >= queue.value.length) {
    finishSession();
    return;
  }

  cardStartedAt.value = Date.now();
};

const queueNextCard = (delay = 220) => {
  clearAdvanceTimeout();

  advanceTimeout = window.setTimeout(() => {
    advanceTimeout = null;
    goToNextCard();
  }, delay);
};

const toggleFlip = () => {
  if (!currentCard.value || isAnswering.value) {
    return;
  }

  if (!flipped.value) {
    getCardState(currentCard.value.id).revealCount += 1;
  }

  flipped.value = !flipped.value;
};

const recordAnswer = (outcome: LearningAttempt["outcome"]) => {
  const card = currentCard.value;

  if (!card || isAnswering.value) {
    return;
  }

  isAnswering.value = true;

  const state = getCardState(card.id);
  const durationMs = Math.max(250, Date.now() - cardStartedAt.value);

  state.attempts.push({
    outcome,
    durationMs,
    viewedAnswer: flipped.value,
    answeredAt: Date.now(),
  });
  state.totalDurationMs += durationMs;

  if (outcome === "known") {
    state.successes += 1;
    queueNextCard(flipped.value ? 240 : 140);
    return;
  }

  state.mistakes += 1;

  if (!queue.value.slice(currentStep.value + 1).includes(card.id)) {
    queue.value.push(card.id);
  }

  if (!flipped.value) {
    state.revealCount += 1;
    flipped.value = true;
    queueNextCard(1100);
    return;
  }

  queueNextCard(380);
};

const markKnown = () => {
  recordAnswer("known");
};

const markMissed = () => {
  recordAnswer("missed");
};

const restartSession = () => {
  startSession(cards.value.map(card => card.id));
};

const restartMistakes = () => {
  const mistakeIds = reports.value
    .filter(report => report.mistakes > 0)
    .map(report => report.card.id);

  if (!mistakeIds.length) {
    return;
  }

  startSession(mistakeIds);
};

watch(
  cards,
  (nextCards) => {
    if (initialized.value || !nextCards.length) {
      return;
    }

    startSession(nextCards.map(card => card.id));
    initialized.value = true;
  },
  { immediate: true },
);

watch(
  () => route.params.id,
  async () => {
    initialized.value = false;
    activeCardIds.value = [];
    queue.value = [];
    currentStep.value = 0;
    sessionFinishedAt.value = null;
    await refresh();
  },
);

watch(currentCardId, (cardId) => {
  if (!cardId || isShowingResults.value) {
    return;
  }

  flipped.value = false;
  cardStartedAt.value = Date.now();
});

onBeforeUnmount(() => {
  clearAdvanceTimeout();
});
</script>

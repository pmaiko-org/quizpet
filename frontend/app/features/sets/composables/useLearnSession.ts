import { useNow } from "@vueuse/core";
import type { RouteLocationRaw } from "vue-router";

import { RouteName } from "~/constants";
import type { ICardDetailsResponse } from "~/types/api.generated";

import type {
  ILearningAttempt,
  ILearningCardReport,
  TLearningOutcome,
} from "../utils";
import { canEditSet, formatTime } from "../utils";

const ANSWER_HOLD_MS = 280;

interface ICardSessionState {
  attempts: ILearningAttempt[];
  mistakes: number;
  successes: number;
  revealCount: number;
  totalDurationMs: number;
}

export const useLearnSession = (currentUserEmail?: Ref<string | undefined>) => {
  const route = useRoute(RouteName.SETS_ID_LEARN);
  const { $repository } = useNuxtApp();

  const setId = computed(() => route.params.id);
  const asyncDataKey = computed(() => `set-learning-${setId.value}`);

  const {
    data: set,
    status,
    error,
    refresh,
  } = useAsyncData(asyncDataKey, () => $repository.sets.getSet(setId.value), {
    server: false,
    dedupe: "defer",
  });

  const cards = computed<ICardDetailsResponse[]>(() => set.value?.cards ?? []);

  const canEdit = computed(() => {
    return canEditSet(set.value ?? null, currentUserEmail?.value);
  });

  const loading = computed(
    () => status.value === "pending" || status.value === "idle",
  );

  const refreshSet = () => refresh();

  const now = useNow({ interval: 250 });

  const activeCardIds = ref<string[]>([]);
  const queue = ref<string[]>([]);
  const currentStep = ref(0);
  const flipped = ref(false);
  const isAnswering = ref(false);
  const lastOutcome = ref<TLearningOutcome | null>(null);
  const sessionStartedAt = ref(0);
  const sessionFinishedAt = ref<number | null>(null);
  const cardStartedAt = ref(0);
  const initialized = ref(false);
  const cardStates = reactive<Record<string, ICardSessionState>>({});

  let advanceTimeout: number | null = null;

  const editSetLink = computed<RouteLocationRaw>(() => {
    return { name: RouteName.SETS_ID_EDIT, params: { id: setId.value } };
  });

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

  const currentCardEditLink = computed<RouteLocationRaw>(() => {
    return {
      name: RouteName.SETS_ID_EDIT,
      params: { id: setId.value },
      ...(currentCard.value ? { query: { card: currentCard.value.id } } : {}),
    };
  });

  const isShowingResults = computed(() => {
    return sessionFinishedAt.value !== null;
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

  const reports = computed<ILearningCardReport[]>(() => {
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
      .filter((report): report is ILearningCardReport => report !== null);
  });

  const learnedCount = computed(() => {
    return reports.value.filter(report => report.successes > 0).length;
  });

  const mistakeCardCount = computed(() => {
    return reports.value.filter(report => report.mistakes > 0).length;
  });

  const clearAdvanceTimeout = () => {
    if (advanceTimeout !== null) {
      window.clearTimeout(advanceTimeout);
      advanceTimeout = null;
    }
  };

  const clearCardStates = () => {
    Object.keys(cardStates).forEach((cardId) => {
      delete cardStates[cardId];
    });
  };

  const resetCardStates = (cardIds: string[]) => {
    clearCardStates();

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

  const resetSession = () => {
    clearAdvanceTimeout();
    activeCardIds.value = [];
    queue.value = [];
    currentStep.value = 0;
    flipped.value = false;
    isAnswering.value = false;
    lastOutcome.value = null;
    sessionStartedAt.value = 0;
    sessionFinishedAt.value = null;
    cardStartedAt.value = 0;
    clearCardStates();
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
    lastOutcome.value = null;
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

  const recordAnswer = (outcome: ILearningAttempt["outcome"]) => {
    const card = currentCard.value;

    if (!card || isAnswering.value) {
      return;
    }

    isAnswering.value = true;
    lastOutcome.value = outcome;

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
      queueNextCard(ANSWER_HOLD_MS);
      return;
    }

    state.mistakes += 1;

    if (!queue.value.slice(currentStep.value + 1).includes(card.id)) {
      queue.value.push(card.id);
    }

    queueNextCard(ANSWER_HOLD_MS);
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
    setId,
    () => {
      initialized.value = false;
      resetSession();
    },
    { flush: "sync" },
  );

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

  return {
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
  };
};

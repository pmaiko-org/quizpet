import { useNow } from "@vueuse/core";
import type { MaybeRefOrGetter } from "vue";
import { computed, onScopeDispose, ref, toValue, watch } from "vue";

import type { ICardDetailsResponse } from "~/shared/types/api.generated";

import {
  buildMatchRounds,
  type IMatchTile,
  shuffleMatchItems,
  type TMatchFeedback,
  type TMatchStatus,
} from "../matching";

const MATCH_FEEDBACK_MS = 450;
const MISMATCH_FEEDBACK_MS = 850;

export const useMatchGame = (
  cards: MaybeRefOrGetter<readonly ICardDetailsResponse[]>,
) => {
  const status = ref<TMatchStatus>("ready");
  const rounds = ref<ICardDetailsResponse[][]>([]);
  const roundIndex = ref(0);
  const terms = ref<ICardDetailsResponse[]>([]);
  const definitions = ref<ICardDetailsResponse[]>([]);
  const selected = ref<IMatchTile | null>(null);
  const compared = ref<IMatchTile | null>(null);
  const feedback = ref<TMatchFeedback | null>(null);
  const matchedIds = ref(new Set<string>());
  const matchedCount = ref(0);
  const mistakes = ref(0);
  const startedAt = ref<number | null>(null);
  const finishedAt = ref<number | null>(null);
  const { now, pause, resume } = useNow({ interval: 250, controls: true });
  pause();

  let feedbackTimeout: ReturnType<typeof setTimeout> | undefined;

  const totalCards = computed(() =>
    rounds.value.reduce((total, round) => total + round.length, 0),
  );
  const roundComplete = computed(
    () =>
      terms.value.length > 0 && matchedIds.value.size === terms.value.length,
  );
  const elapsedMs = computed(() =>
    startedAt.value === null
      ? 0
      : Math.max(0, (finishedAt.value ?? Number(now.value)) - startedAt.value),
  );
  const accuracy = computed(() => {
    const attempts = matchedCount.value + mistakes.value;
    return attempts ? Math.round((matchedCount.value / attempts) * 100) : 0;
  });

  const clearFeedback = () => {
    clearTimeout(feedbackTimeout);
    feedbackTimeout = undefined;
    selected.value = null;
    compared.value = null;
    feedback.value = null;
  };

  const reset = () => {
    clearFeedback();
    pause();
    status.value = "ready";
    rounds.value = [];
    roundIndex.value = 0;
    terms.value = [];
    definitions.value = [];
    matchedIds.value = new Set();
    matchedCount.value = 0;
    mistakes.value = 0;
    startedAt.value = null;
    finishedAt.value = null;
  };

  const loadRound = () => {
    const round = rounds.value[roundIndex.value] ?? [];
    terms.value = shuffleMatchItems(round);
    definitions.value = shuffleMatchItems(round);
    matchedIds.value = new Set();
    clearFeedback();
  };

  const start = () => {
    reset();
    rounds.value = buildMatchRounds(toValue(cards));

    if (!rounds.value.length) {
      return;
    }

    loadRound();
    startedAt.value = Date.now();
    status.value = "playing";
    resume();
  };

  const nextRound = () => {
    if (
      status.value !== "playing" ||
      feedback.value ||
      !roundComplete.value ||
      roundIndex.value + 1 >= rounds.value.length
    ) {
      return;
    }

    roundIndex.value += 1;
    loadRound();
  };

  const selectTile = (tile: IMatchTile) => {
    if (
      status.value !== "playing" ||
      feedback.value ||
      roundComplete.value ||
      matchedIds.value.has(tile.cardId) ||
      !terms.value.some(card => card.id === tile.cardId)
    ) {
      return;
    }

    if (!selected.value || selected.value.side === tile.side) {
      selected.value = selected.value?.cardId === tile.cardId ? null : tile;
      return;
    }

    compared.value = tile;
    const isMatch = selected.value.cardId === tile.cardId;
    feedback.value = isMatch ? "success" : "error";

    if (isMatch) {
      matchedIds.value.add(tile.cardId);
      matchedCount.value += 1;

      if (matchedCount.value === totalCards.value) {
        finishedAt.value = Date.now();
        pause();
      }
    } else {
      mistakes.value += 1;
    }

    feedbackTimeout = setTimeout(
      () => {
        clearFeedback();
        if (finishedAt.value !== null) {
          status.value = "finished";
        }
      },
      isMatch ? MATCH_FEEDBACK_MS : MISMATCH_FEEDBACK_MS,
    );
  };

  watch(() => toValue(cards), reset, { flush: "sync" });
  onScopeDispose(() => {
    clearFeedback();
    pause();
  });

  return {
    status,
    roundIndex,
    roundCount: computed(() => rounds.value.length),
    terms,
    definitions,
    selected,
    compared,
    feedback,
    matchedIds,
    matchedCount,
    mistakes,
    totalCards,
    roundComplete,
    elapsedMs,
    accuracy,
    start,
    reset,
    nextRound,
    selectTile,
  };
};

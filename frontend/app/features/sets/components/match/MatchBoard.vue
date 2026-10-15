<template>
  <section
    ref="board"
    class="space-y-4"
    aria-labelledby="match-round-title"
  >
    <div class="flex flex-wrap items-center justify-between gap-2">
      <h2
        id="match-round-title"
        ref="heading"
        tabindex="-1"
        class="
          text-lg font-semibold text-highlighted
          focus:outline-none
        "
      >
        {{ $t("match.round", { current: roundNumber, total: roundCount }) }}
      </h2>
      <p class="text-sm text-muted">
        {{
          $t("match.pairsProgress", {
            matched: matchedIds.size,
            total: terms.length,
          })
        }}
      </p>
    </div>

    <div
      class="
        grid grid-cols-2 items-start gap-3
        sm:gap-5
      "
    >
      <div
        v-for="column in columns"
        :key="column.side"
        class="min-w-0 space-y-3"
      >
        <h3 class="text-xs font-semibold tracking-wider text-muted uppercase">
          {{ column.label }}
        </h3>
        <MatchTile
          v-for="card in column.cards"
          :key="`${column.side}-${card.id}`"
          :text="card[column.side]"
          :selected="isSelected(card.id, column.side)"
          :matched="matchedIds.has(card.id)"
          :locked="feedback !== null"
          :feedback="isSelected(card.id, column.side) ? feedback : null"
          @select="emit('select', { cardId: card.id, side: column.side })"
        />
      </div>
    </div>

    <div class="flex min-h-12 flex-wrap items-center justify-between gap-3">
      <p
        role="status"
        aria-live="polite"
        aria-atomic="true"
        class="text-sm text-toned"
      >
        {{ feedbackMessage }}
      </p>
      <UButton
        v-if="roundComplete && !feedback && roundNumber < roundCount"
        icon="i-lucide-arrow-right"
        trailing
        size="lg"
        @click="emit('nextRound')"
      >
        {{ $t("match.nextRound") }}
      </UButton>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { ICardDetailsResponse } from "~/shared/types/api.generated";

import type { IMatchTile, TMatchFeedback, TMatchSide } from "../../matching";

const {
  terms,
  definitions,
  selected,
  compared,
  feedback,
  matchedIds,
  roundNumber,
  roundCount,
  roundComplete,
} = defineProps<{
  terms: ICardDetailsResponse[];
  definitions: ICardDetailsResponse[];
  selected: IMatchTile | null;
  compared: IMatchTile | null;
  feedback: TMatchFeedback | null;
  matchedIds: Set<string>;
  roundNumber: number;
  roundCount: number;
  roundComplete: boolean;
}>();

const emit = defineEmits<{
  select: [tile: IMatchTile];
  nextRound: [];
}>();

const board = useTemplateRef("board");
const heading = useTemplateRef("heading");
const { t } = useI18n();
const columns = computed(() => [
  { side: "term" as const, label: t("match.words"), cards: terms },
  {
    side: "definition" as const,
    label: t("match.definitions"),
    cards: definitions,
  },
]);
const isSelected = (cardId: string, side: TMatchSide) => {
  return [selected, compared].some(
    tile => tile?.cardId === cardId && tile.side === side,
  );
};
const feedbackMessage = computed(() => {
  if (feedback === "error") return t("match.feedback.error");
  if (feedback === "success") return t("match.feedback.success");
  if (roundComplete) return t("match.feedback.roundComplete");
  return selected ? t("match.feedback.choosePair") : t("match.feedback.start");
});

onMounted(() => heading.value?.focus());
watch(
  () => roundNumber,
  () => heading.value?.focus(),
  { flush: "post" },
);
watch(
  () => feedback,
  (value) => {
    if (value || !board.value?.contains(document.activeElement)) return;
    if (
      document.activeElement instanceof HTMLButtonElement &&
      document.activeElement.disabled
    ) {
      board.value
        .querySelector<HTMLButtonElement>("button:not(:disabled)")
        ?.focus();
    }
  },
  { flush: "post" },
);
</script>

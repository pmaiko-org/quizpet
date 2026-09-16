<template>
  <div class="space-y-5">
    <BaseHeroSection
      eyebrow="Гра для компанії"
      title="ПИТАНЯЧКА"
      description="Усі, хто зайшов на цю сторінку, автоматично в грі. Будь-хто генерує питання, читає його вголос і передає хід далі."
    />

    <PitanyachkaControls
      :connected="connected"
      :started="state.started"
      :playersCount="state.players.length"
      :remaining="state.remaining"
      :total="state.total"
      @start="start"
      @reset="reset"
    />

    <PitanyachkaQuestionCard
      v-if="isReader && myQuestion"
      :question="myQuestion"
      @pass="passTurn"
    />

    <PitanyachkaStage
      v-else-if="isReading"
      icon="i-lucide-mic"
      :title="`${state.readerName} читає своє питання`"
      description="Слухайте уважно та чекайте, поки хід передадуть далі."
    />

    <PitanyachkaStage
      v-else-if="!state.started"
      icon="i-lucide-play"
      title="Готові грати?"
      description="Натисніть «Старт», щоб почати нову гру для всієї компанії."
    />

    <PitanyachkaStage
      v-else-if="state.remaining === 0"
      icon="i-lucide-party-popper"
      title="Питання закінчились"
      description="Усі питання вже прозвучали. Натисніть «Скинути», щоб повернути їх у колоду."
    />

    <PitanyachkaStage
      v-else
      icon="i-lucide-sparkles"
      title="Хід вільний"
      description="Будь-хто з гравців може згенерувати наступне питання."
    >
      <UButton
        color="primary"
        variant="solid"
        size="lg"
        icon="i-lucide-dices"
        :disabled="!connected"
        @click="generateQuestion"
      >
        Згенерувати питання
      </UButton>
    </PitanyachkaStage>

    <PitanyachkaPlayers
      :players="state.players"
      :readerId="state.readerId"
    />
  </div>
</template>

<script setup lang="ts">
import { PitanyachkaPhase } from "../types";

const { user } = useCurrentUser();

const playerName = computed(() => {
  const fullName =
    `${user.value?.firstName ?? ""} ${user.value?.lastName ?? ""}`.trim();
  return fullName || user.value?.email || "Гравець";
});

const {
  connected,
  state,
  myQuestion,
  isReader,
  start,
  reset,
  generateQuestion,
  passTurn,
} = usePitanyachka(playerName);

const isReading = computed(
  () => state.value.phase === PitanyachkaPhase.READING,
);
</script>

<template>
  <div class="space-y-5">
    <BaseHeroSection
      :eyebrow="$t('pitanyachka.hero.eyebrow')"
      :title="$t('pitanyachka.hero.title')"
      :description="$t('pitanyachka.hero.description')"
    />

    <PitanyachkaControls
      :connected="connected"
      :started="state.started"
      :playersCount="state.players.length"
      :remaining="state.remaining"
      :total="state.total"
      :categoryLabel="state.selectedCategory"
      @restart="restart"
    />

    <PitanyachkaQuestionCard
      v-if="isReader && myQuestion"
      :question="myQuestion"
      @pass="passTurn"
    />

    <PitanyachkaStage
      v-else-if="isReading"
      icon="i-lucide-mic"
      :title="$t('pitanyachka.reading.title', { name: state.readerName })"
      :description="$t('pitanyachka.reading.description')"
    />

    <PitanyachkaCategoryPicker
      v-else-if="!state.started"
      :categories="categories"
      :disabled="!connected"
      @start="start"
    />

    <PitanyachkaStage
      v-else-if="state.remaining === 0"
      icon="i-lucide-party-popper"
      :title="$t('pitanyachka.finished.title')"
      :description="$t('pitanyachka.finished.description')"
    />

    <PitanyachkaStage
      v-else
      icon="i-lucide-sparkles"
      :title="$t('pitanyachka.free.title')"
      :description="$t('pitanyachka.free.description')"
    >
      <UButton
        color="primary"
        variant="solid"
        size="lg"
        icon="i-lucide-dices"
        :disabled="!connected"
        @click="generateQuestion"
      >
        {{ $t("pitanyachka.generate") }}
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
  return fullName || user.value?.email || t("pitanyachka.player");
});

const { t } = useI18n();

const {
  connected,
  state,
  myQuestion,
  categories,
  isReader,
  start,
  restart,
  generateQuestion,
  passTurn,
} = usePitanyachka(playerName);

const isReading = computed(
  () => state.value.phase === PitanyachkaPhase.READING,
);
</script>

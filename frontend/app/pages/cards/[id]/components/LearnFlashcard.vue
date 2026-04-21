<template>
  <section class="mb-2">
    <div
      class="
        mb-4 flex flex-col gap-4
        lg:flex-row lg:items-start lg:justify-between
      "
    >
      <div class="space-y-3">
        <div class="flex flex-wrap gap-2">
          <UBadge
            variant="soft"
            color="primary"
            size="lg"
            class="rounded-full px-3 py-1"
          >
            Картка {{ currentStep }}
          </UBadge>

          <div
            class="rounded-full border px-3 py-1 text-sm"
            :style="theme.accentStyle"
          >
            {{ flipped ? "Definition" : "Term" }}
          </div>

          <div
            class="rounded-full border px-3 py-1 text-sm"
            :style="theme.accentStyle"
          >
            {{ currentCardTime }}
          </div>
        </div>
      </div>

      <div class="flex flex-wrap gap-2">
        <UButton
          v-if="isSupported"
          size="lg"
          color="neutral"
          variant="outline"
          icon="i-lucide-volume-2"
          :disabled="isSpeaking"
          @click.stop="speakCurrentSide"
        >
          Озвучити
        </UButton>

        <UButton
          size="lg"
          variant="outline"
          color="neutral"
          icon="i-lucide-pencil"
          :to="editLink"
        >
          Редагувати
        </UButton>
      </div>
    </div>

    <div class="perspective-[2200px]">
      <button
        type="button"
        class="
          group block w-full rounded-2xl text-left
          focus:outline-none
          focus-visible:ring-2 focus-visible:ring-primary/70
        "
        :aria-pressed="flipped"
        @click="$emit('flip')"
        @keydown.enter.prevent="$emit('flip')"
        @keydown.space.prevent="$emit('flip')"
      >
        <div
          class="
            relative h-100 w-full transition-transform duration-500 transform-3d
            md:h-124
          "
          :class="flipped ? 'transform-[rotateY(180deg)]' : ''"
        >
          <LearnCard
            badge="term"
            :title="card.term"
            :description="card.termDescription"
            :image="card.termImage"
          />
          <LearnCard
            badge="definition"
            :title="card.definition"
            :description="null"
            :image="card.definitionImage"
            class="transform-[rotateY(180deg)]"
          />
        </div>
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { buildFlashcardTheme } from "~/utils/cardLearning";
import type { ICardDetailsResponse } from "~/types/api.generated";

const props = defineProps<{
  card: ICardDetailsResponse;
  currentStep: number;
  currentCardTime: string;
  flipped: boolean;
  editLink: string;
}>();

defineEmits<{
  flip: [];
}>();

const { isSupported, isSpeaking, speak, stop } = useCardSpeech();

const theme = computed(() => buildFlashcardTheme(props.card));

const speakCurrentSide = () => {
  const text = props.flipped ? props.card.definition : props.card.term;

  if (!text.trim()) {
    return;
  }

  if (isSpeaking.value) {
    stop();
    return;
  }

  speak(text);
};
</script>

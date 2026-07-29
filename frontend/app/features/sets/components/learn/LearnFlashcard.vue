<template>
  <section>
    <div
      class="
        mb-2 grid gap-2
        sm:grid-cols-[auto_minmax(13rem,1fr)_auto] sm:items-center
      "
    >
      <div class="flex items-center gap-2">
        <UBadge
          variant="soft"
          color="primary"
          class="app-radius-control"
        >
          Картка {{ currentStep }}
        </UBadge>

        <span
          class="
            app-radius-control inline-flex items-center gap-1 border px-2 py-1
            text-xs
          "
          :style="theme.accentStyle"
        >
          <UIcon
            name="i-lucide-timer"
            class="size-3"
          />
          {{ currentCardTime }}
        </span>
      </div>

      <div
        class="
          app-radius-control order-3 grid grid-cols-2 bg-muted p-1
          sm:order-0 sm:mx-auto sm:w-full sm:max-w-64
        "
        aria-label="Сторона картки"
      >
        <button
          type="button"
          class="
            app-radius-control px-3 py-1.5 text-xs font-semibold
            transition-colors
            focus-visible:outline-2 focus-visible:outline-primary
          "
          :class="!flipped
            ? 'bg-elevated text-highlighted shadow-sm'
            : `
              text-muted
              hover:text-default
            `"
          :aria-pressed="!flipped"
          @click="showTerm"
        >
          Термін
        </button>
        <button
          type="button"
          class="
            app-radius-control px-3 py-1.5 text-xs font-semibold
            transition-colors
            focus-visible:outline-2 focus-visible:outline-primary
          "
          :class="flipped
            ? 'bg-elevated text-highlighted shadow-sm'
            : `
              text-muted
              hover:text-default
            `"
          :aria-pressed="flipped"
          @click="showDefinition"
        >
          Відповідь
        </button>
      </div>

      <div class="ml-auto flex items-center gap-1">
        <UButton
          v-if="isSupported"
          size="sm"
          color="neutral"
          variant="ghost"
          :icon="isSpeaking ? 'i-lucide-square' : 'i-lucide-volume-2'"
          :aria-label="isSpeaking ? 'Зупинити озвучення' : 'Озвучити картку'"
          @click.stop="speakCurrentSide"
        />

        <UButton
          size="sm"
          variant="ghost"
          color="neutral"
          icon="i-lucide-pencil"
          :to="editLink"
          aria-label="Редагувати картку"
        />
      </div>
    </div>

    <div
      role="button"
      tabindex="0"
      class="
        group app-radius-surface block w-full text-left
        focus:outline-none
        focus-visible:ring-2 focus-visible:ring-primary/70
      "
      :aria-pressed="flipped"
      :aria-label="flipped ? 'Показати термін' : 'Показати відповідь'"
      @click="$emit('flip')"
      @keydown.enter.prevent="$emit('flip')"
      @keydown.space.prevent="$emit('flip')"
    >
      <Transition
        name="learn-side"
        mode="out-in"
      >
        <LearnCard
          :key="flipped ? 'definition' : 'term'"
          :badge="flipped ? 'Відповідь' : 'Термін'"
          :title="flipped ? card.definition : card.term"
          :description="flipped ? null : card.termDescription"
          :image="flipped ? card.definitionImage : card.termImage"
          :style="theme.cardStyle"
        />
      </Transition>
    </div>

    <p class="mt-2 text-center text-xs text-muted">
      Натисніть картку або перемикач вище, щоб побачити іншу сторону
    </p>
  </section>
</template>

<script setup lang="ts">
import type { ICardDetailsResponse } from "~/types/api.generated";

import { buildFlashcardTheme } from "../../utils";

const {
  card,
  currentStep,
  currentCardTime,
  flipped,
  editLink,
} = defineProps<{
  card: ICardDetailsResponse;
  currentStep: number;
  currentCardTime: string;
  flipped: boolean;
  editLink: string;
}>();

const emit = defineEmits<{
  flip: [];
}>();

const { isSupported, isSpeaking, speak, stop } = useCardSpeech();

const theme = computed(() => buildFlashcardTheme(card));

const showTerm = () => {
  if (flipped) {
    stop();
    emit("flip");
  }
};

const showDefinition = () => {
  if (!flipped) {
    stop();
    emit("flip");
  }
};

const speakCurrentSide = () => {
  const text = flipped ? card.definition : card.term;

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

<style scoped>
.learn-side-enter-active,
.learn-side-leave-active {
  transition:
    opacity 160ms ease,
    transform 160ms ease;
}

.learn-side-enter-from,
.learn-side-leave-to {
  opacity: 0;
  transform: translateY(4px);
}

@media (prefers-reduced-motion: reduce) {
  .learn-side-enter-active,
  .learn-side-leave-active {
    transition: none;
  }
}
</style>

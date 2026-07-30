<template>
  <section class="flex h-full min-h-0 flex-col gap-2">
    <div class="flex shrink-0 items-center gap-2">
      <UBadge
        variant="soft"
        color="primary"
        class="app-radius-control shrink-0"
      >
        Картка {{ currentStep }}
      </UBadge>

      <span
        class="
          app-radius-control inline-flex shrink-0 items-center gap-1 border px-2
          py-1 text-xs
        "
        :style="theme.accentStyle"
      >
        <UIcon
          name="i-lucide-timer"
          class="size-3"
        />
        {{ currentCardTime }}
      </span>

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

        <UButton
          v-if="fullscreenSupported"
          size="sm"
          variant="ghost"
          color="neutral"
          :icon="isFullscreen ? 'i-lucide-minimize' : 'i-lucide-maximize'"
          :aria-label="isFullscreen ? 'Вийти з повного екрана' : 'Повний екран'"
          @click="emit('toggle-fullscreen')"
        />
      </div>
    </div>

    <div
      role="button"
      tabindex="0"
      class="
        group app-radius-surface relative block min-h-0 w-full flex-1 text-left
        focus:outline-none
        focus-visible:ring-2 focus-visible:ring-primary/70
      "
      :aria-pressed="flipped"
      :aria-label="flipped ? 'Показати термін' : 'Показати відповідь'"
      @click="emit('flip')"
      @keydown.enter.prevent="emit('flip')"
    >
      <UPopover class="absolute top-2 left-2 z-20">
        <UButton
          icon="i-lucide-lightbulb"
          size="xs"
          color="neutral"
          variant="ghost"
          class="
            app-radius-control rounded-full! bg-elevated/70 p-2 backdrop-blur-sm
          "
          aria-label="Підказки та керування з клавіатури"
          @click.stop
          @keydown.enter.stop
          @keydown.space.stop
        />

        <template #content>
          <div class="max-w-xs space-y-3 p-3 text-sm">
            <p class="text-highlighted">
              Натисніть картку, щоб побачити іншу сторону
            </p>

            <div class="space-y-1.5 text-muted">
              <div class="flex items-center gap-2">
                <UKbd>←</UKbd>
                <span>Не знаю</span>
              </div>
              <div class="flex items-center gap-2">
                <UKbd>→</UKbd>
                <span>Знаю, далі</span>
              </div>
              <div class="flex items-center gap-2">
                <UKbd>Пробіл</UKbd>
                <span>Перевернути картку</span>
              </div>
            </div>

            <div class="space-y-1.5 border-t border-default pt-3 text-muted">
              <p class="text-xs font-medium text-highlighted">
                Кут картки
              </p>
              <div class="flex items-center gap-2">
                <span class="size-3 shrink-0 rounded-[3px] bg-sky-500/80" />
                <span>Термін</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="size-3 shrink-0 rounded-[3px] bg-emerald-500/80" />
                <span>Відповідь</span>
              </div>
            </div>
          </div>
        </template>
      </UPopover>

      <LearnCard
        :key="flipped ? 'definition' : 'term'"
        class="learn-side"
        :side="flipped ? 'definition' : 'term'"
        :badge="flipped ? 'Відповідь' : 'Термін'"
        :title="flipped ? card.definition : card.term"
        :description="flipped ? null : card.termDescription"
        :image="flipped ? card.definitionImage : card.termImage"
        :style="theme.cardStyle"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import type { ICardDetailsResponse } from "~/types/api.generated";

import { buildFlashcardTheme } from "../../utils";

const { card, flipped } = defineProps<{
  card: ICardDetailsResponse;
  currentStep: number;
  currentCardTime: string;
  flipped: boolean;
  editLink: string;
  fullscreenSupported?: boolean;
  isFullscreen?: boolean;
}>();

const emit = defineEmits<{
  "flip": [];
  "toggle-fullscreen": [];
}>();

const { isSupported, isSpeaking, speak, stop } = useCardSpeech();

const theme = computed(() => buildFlashcardTheme(card));

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
.learn-side {
  animation: learn-side-in 160ms ease both;
}

@keyframes learn-side-in {
  from {
    opacity: 0;
    transform: translateY(4px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .learn-side {
    animation: none;
  }
}
</style>

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
          v-if="canEdit"
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
      ref="swipeAreaRef"
      role="button"
      tabindex="0"
      class="
        group app-radius-surface relative block min-h-0 w-full flex-1
        touch-pan-y text-left select-none
        focus:outline-none
        focus-visible:ring-2 focus-visible:ring-primary/70
      "
      :aria-pressed="flipped"
      :aria-label="flipped ? 'Показати термін' : 'Показати відповідь'"
      @click="onCardClick"
      @keydown.enter.prevent="emit('flip')"
    >
      <div class="absolute top-2 left-2 z-20 flex items-center gap-1">
        <UPopover>
          <UButton
            icon="i-lucide-info"
            size="xs"
            color="neutral"
            variant="ghost"
            class="
              app-radius-control rounded-full! bg-elevated/70 p-2
              backdrop-blur-sm
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

              <div class="border-t border-default pt-3 text-muted">
                <div class="flex items-center gap-2">
                  <UIcon
                    name="i-lucide-move-horizontal"
                    class="size-4 shrink-0"
                  />
                  <span>Свайп вправо — не знаю, вліво — знаю</span>
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
                  <span
                    class="size-3 shrink-0 rounded-[3px] bg-emerald-500/80"
                  />
                  <span>Відповідь</span>
                </div>
              </div>
            </div>
          </template>
        </UPopover>

        <UPopover v-if="hasAnswerHint">
          <UButton
            icon="i-lucide-lightbulb"
            size="xs"
            color="neutral"
            variant="ghost"
            class="
              app-radius-control rounded-full! bg-elevated/70 p-2 text-amber-500
              backdrop-blur-sm
            "
            aria-label="Підказка: перша літера відповіді"
            @click.stop
            @keydown.enter.stop
            @keydown.space.stop
          />

          <template #content>
            <div class="max-w-xs space-y-3 p-4">
              <div class="flex items-center gap-2 text-highlighted">
                <UIcon
                  name="i-lucide-lightbulb"
                  class="size-4 text-amber-500"
                />
                <p class="text-sm font-medium">
                  Підказка
                </p>
              </div>

              <div class="flex items-center gap-3">
                <span
                  class="
                    app-radius-control flex size-12 shrink-0 items-center
                    justify-center border text-2xl font-bold uppercase
                  "
                  :style="theme.accentStyle"
                >
                  {{ answerFirstLetter }}
                </span>

                <span
                  v-if="answerMask"
                  class="
                    font-mono text-lg leading-none tracking-[0.35em] break-all
                    text-toned
                  "
                >
                  {{ answerMask }}
                </span>
              </div>

              <p class="text-xs text-muted">
                Перша літера відповіді — решту згадайте самі.
              </p>
            </div>
          </template>
        </UPopover>
      </div>

      <div
        class="size-full"
        :style="swipeStyle"
      >
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

      <div
        v-if="swipeHint"
        class="learn-swipe-hint app-radius-surface"
        :class="swipeHint === 'known' ? 'is-known' : 'is-missed'"
        :style="{ opacity: swipeHintOpacity }"
        aria-hidden="true"
      >
        <div class="learn-swipe-hint__badge">
          <UIcon
            :name="
              swipeHint === 'known' ? 'i-lucide-check' : 'i-lucide-rotate-ccw'
            "
            class="size-9"
          />
          <span>{{ swipeHint === "known" ? "Знаю" : "Не знаю" }}</span>
        </div>
      </div>

      <Transition name="learn-verdict">
        <div
          v-if="answering && outcome"
          class="learn-verdict app-radius-surface"
          :class="outcome === 'known' ? 'is-known' : 'is-missed'"
          aria-hidden="true"
        >
          <div class="learn-verdict__badge">
            <UIcon
              :name="
                outcome === 'known' ? 'i-lucide-check' : 'i-lucide-rotate-ccw'
              "
              class="size-9"
            />
            <span>{{ outcome === "known" ? "Знаю" : "Не знаю" }}</span>
          </div>
        </div>
      </Transition>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { ICardDetailsResponse } from "~/types/api.generated";

import { useLearnCardSwipe } from "../../composables/useLearnCardSwipe";
import { buildFlashcardTheme, type TLearningOutcome } from "../../utils";

const {
  card,
  flipped,
  answering = false,
} = defineProps<{
  card: ICardDetailsResponse;
  currentStep: number;
  currentCardTime: string;
  flipped: boolean;
  answering?: boolean;
  outcome?: TLearningOutcome | null;
  canEdit?: boolean;
  editLink: string;
  fullscreenSupported?: boolean;
  isFullscreen?: boolean;
}>();

const emit = defineEmits<{
  "flip": [];
  "known": [];
  "missed": [];
  "toggle-fullscreen": [];
}>();

const { isSupported, isSpeaking, speak, stop } = useCardSpeech();

const theme = computed(() => buildFlashcardTheme(card));

const hiddenSideText = computed(() => {
  return (flipped ? card.term : card.definition).trim();
});

const hasAnswerHint = computed(() => hiddenSideText.value.length > 0);

const answerFirstLetter = computed(() => {
  return hiddenSideText.value.charAt(0).toUpperCase();
});

const answerMask = computed(() => {
  return [...hiddenSideText.value.slice(1)]
    .map(char => (/\s/u.test(char) ? " " : "•"))
    .join("");
});

const swipeAreaRef = ref<HTMLElement | null>(null);

const { swipeStyle, swipeHint, swipeHintOpacity, onCardClick } =
  useLearnCardSwipe(swipeAreaRef, {
    disabled: () => answering,
    onTap: () => emit("flip"),
    onKnown: () => emit("known"),
    onMissed: () => emit("missed"),
  });

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

.learn-swipe-hint {
  position: absolute;
  inset: 0;
  z-index: 12;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 2px solid transparent;
  pointer-events: none;
}

.learn-swipe-hint.is-known {
  border-color: rgba(16, 185, 129, 0.7);
  background: rgba(16, 185, 129, 0.12);
  color: rgb(52, 211, 153);
}

.learn-swipe-hint.is-missed {
  border-color: rgba(245, 158, 11, 0.7);
  background: rgba(245, 158, 11, 0.12);
  color: rgb(251, 191, 36);
}

.learn-swipe-hint__badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  font-size: clamp(1.5rem, 6vw, 2.5rem);
  font-weight: 700;
  letter-spacing: -0.01em;
}

.learn-verdict {
  position: absolute;
  inset: 0;
  z-index: 15;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 2px solid transparent;
  backdrop-filter: blur(1px);
}

.learn-verdict.is-known {
  border-color: rgba(16, 185, 129, 0.7);
  background: rgba(16, 185, 129, 0.14);
  color: rgb(52, 211, 153);
}

.learn-verdict.is-missed {
  border-color: rgba(245, 158, 11, 0.7);
  background: rgba(245, 158, 11, 0.14);
  color: rgb(251, 191, 36);
}

.learn-verdict__badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  font-size: clamp(1.75rem, 7vw, 2.75rem);
  font-weight: 700;
  letter-spacing: -0.01em;
  animation: learn-verdict-pop 240ms cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

@keyframes learn-verdict-pop {
  from {
    opacity: 0;
    transform: scale(0.82);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

.learn-verdict-enter-active {
  transition: opacity 140ms ease;
}

.learn-verdict-enter-from {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .learn-verdict__badge {
    animation: none;
  }
}
</style>

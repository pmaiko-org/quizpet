<template>
  <section class="rounded-[2rem] border border-default bg-default/85 p-5 shadow-sm sm:p-6">
    <div class="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div class="space-y-3">
        <div class="flex flex-wrap gap-2">
          <UBadge
            variant="soft"
            color="primary"
            size="lg"
            class="rounded-full px-3 py-1"
          >
            Картка {{ currentPosition }}
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

        <div>
          <h2 class="text-2xl font-semibold text-highlighted sm:text-3xl">
            {{ flipped ? "Звірте відповідь і оцініть себе" : "Спробуйте згадати відповідь самостійно" }}
          </h2>
          <p class="mt-2 max-w-2xl text-sm leading-6 text-toned">
            {{ flipped ? "Торкніться картки ще раз, якщо хочете повернутися на лицьову сторону." : "На мобільному картка лишається великою і зручною для тапу, а кнопки дій завжди під рукою." }}
          </p>
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
        class="group block w-full rounded-[2rem] text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
        :aria-pressed="flipped"
        @click="$emit('flip')"
        @keydown.enter.prevent="$emit('flip')"
        @keydown.space.prevent="$emit('flip')"
      >
        <div
          class="relative min-h-[27rem] w-full transition-transform duration-500 [transform-style:preserve-3d] sm:min-h-[31rem]"
          :class="flipped ? '[transform:rotateY(180deg)]' : ''"
        >
          <article
            class="absolute inset-0 overflow-hidden rounded-[2rem] border p-5 [backface-visibility:hidden] sm:p-7"
            :style="theme.cardStyle"
          >
            <div class="flex h-full flex-col gap-5">
              <div class="flex items-start justify-between gap-4">
                <div>
                  <p class="text-xs uppercase tracking-[0.24em] opacity-70">
                    Лицьова сторона
                  </p>
                  <h3 class="mt-2 text-xl font-semibold sm:text-2xl">
                    {{ card.term }}
                  </h3>
                </div>

                <div
                  class="rounded-full border px-3 py-1 text-sm"
                  :style="theme.accentStyle"
                >
                  term
                </div>
              </div>

              <div class="grid flex-1 gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(16rem,0.9fr)]">
                <div class="flex flex-col justify-between gap-5">
                  <p class="text-base leading-7 opacity-90 sm:text-lg">
                    Подумайте над визначенням, а потім переверніть картку або одразу оцініть себе кнопками нижче.
                  </p>

                  <div class="flex flex-wrap gap-2">
                    <div
                      class="rounded-full border px-3 py-1 text-sm"
                      :style="theme.accentStyle"
                    >
                      Натисніть для перевороту
                    </div>

                    <div
                      v-if="card.termImage"
                      class="rounded-full border px-3 py-1 text-sm"
                      :style="theme.accentStyle"
                    >
                      Є ілюстрація
                    </div>
                  </div>
                </div>

                <div
                  v-if="card.termImage"
                  class="overflow-hidden rounded-[1.5rem] border p-2"
                  :style="theme.imageFrameStyle"
                >
                  <img
                    :src="card.termImage.src"
                    :alt="card.termImage.name || card.term"
                    class="h-full max-h-[18rem] w-full rounded-[1.25rem] object-cover sm:max-h-[22rem]"
                  >
                </div>
              </div>
            </div>
          </article>

          <article
            class="absolute inset-0 overflow-hidden rounded-[2rem] border p-5 [backface-visibility:hidden] [transform:rotateY(180deg)] sm:p-7"
            :style="theme.cardStyle"
          >
            <div class="flex h-full flex-col gap-5">
              <div class="flex items-start justify-between gap-4">
                <div>
                  <p class="text-xs uppercase tracking-[0.24em] opacity-70">
                    Зворотна сторона
                  </p>
                  <h3 class="mt-2 text-xl font-semibold sm:text-2xl">
                    {{ card.definition }}
                  </h3>
                </div>

                <div
                  class="rounded-full border px-3 py-1 text-sm"
                  :style="theme.accentStyle"
                >
                  definition
                </div>
              </div>

              <div class="grid flex-1 gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(16rem,0.9fr)]">
                <div class="flex flex-col justify-between gap-5">
                  <p class="text-base leading-7 opacity-90 sm:text-lg">
                    Оцініть, наскільки точно ви згадали картку. Якщо була пауза або сумнів, краще повернути її в повторення.
                  </p>

                  <div class="flex flex-wrap gap-2">
                    <div
                      class="rounded-full border px-3 py-1 text-sm"
                      :style="theme.accentStyle"
                    >
                      Відкрита відповідь
                    </div>

                    <div
                      v-if="card.definitionImage"
                      class="rounded-full border px-3 py-1 text-sm"
                      :style="theme.accentStyle"
                    >
                      Є зображення для відповіді
                    </div>
                  </div>
                </div>

                <div
                  v-if="card.definitionImage"
                  class="overflow-hidden rounded-[1.5rem] border p-2"
                  :style="theme.imageFrameStyle"
                >
                  <img
                    :src="card.definitionImage.src"
                    :alt="card.definitionImage.name || card.definition"
                    class="h-full max-h-[18rem] w-full rounded-[1.25rem] object-cover sm:max-h-[22rem]"
                  >
                </div>
              </div>
            </div>
          </article>
        </div>
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { ICardDetails } from "~/repository/cards";
import { buildFlashcardTheme } from "~/utils/cardLearning";

const props = defineProps<{
  card: ICardDetails;
  currentPosition: number;
  currentCardTime: string;
  flipped: boolean;
  editLink: string;
}>();

defineEmits<{
  flip: [];
}>();

const {
  isSupported,
  isSpeaking,
  speak,
  stop,
} = useCardSpeech();

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

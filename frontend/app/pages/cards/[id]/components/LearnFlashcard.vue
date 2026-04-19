<template>
  <section
    class="
      rounded-4xl border border-default bg-default/85 p-5 shadow-sm
      sm:p-6
    "
  >
    <div
      class="
        mb-5 flex flex-col gap-4
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
          group block w-full rounded-4xl text-left
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
            relative min-h-108 w-full transition-transform duration-500
            transform-3d
            sm:min-h-124
          "
          :class="flipped ? 'transform-[rotateY(180deg)]' : ''"
        >
          <article
            class="
              absolute inset-0 overflow-hidden rounded-4xl border p-5
              backface-hidden
              sm:p-7
            "
            :style="theme.cardStyle"
          >
            <div
              class="
                absolute top-5 left-5 rounded-full border px-3 py-1 text-sm
                sm:top-7 sm:left-7
              "
              :style="theme.accentStyle"
            >
              term
            </div>

            <div
              class="grid h-full gap-5"
              :class="[
                hasTermImage
                  ? `
                    pt-10 pb-0
                    sm:pb-10
                    lg:grid-cols-[minmax(0,1.1fr)_minmax(16rem,0.9fr)]
                  `
                  : 'place-items-center text-center',
              ]"
            >
              <div
                class="flex flex-col gap-4"
                :class="
                  hasTermImage
                    ? 'justify-center'
                    : 'max-w-3xl items-center justify-center'
                "
              >
                <div>
                  <h3
                    class="
                      text-4xl/tight font-semibold text-highlighted
                      sm:text-5xl
                      lg:text-6xl
                    "
                  >
                    {{ card.term }}
                  </h3>
                  <p
                    v-if="card.termDescription"
                    class="
                      mt-2 text-base/7 opacity-85
                      sm:text-lg
                    "
                  >
                    {{ card.termDescription }}
                  </p>
                </div>
              </div>

              <div
                v-if="hasTermImage"
                class="overflow-hidden rounded-[1.5rem] border p-2"
                :style="theme.imageFrameStyle"
              >
                <img
                  :src="card.termImage!.src"
                  :alt="card.termImage!.name || card.term"
                  class="
                    size-full max-h-72 rounded-[1.25rem] object-cover
                    sm:max-h-88
                  "
                >
              </div>
            </div>
          </article>

          <article
            class="
              absolute inset-0 transform-[rotateY(180deg)] overflow-hidden
              rounded-4xl border p-5 backface-hidden
              sm:p-7
            "
            :style="theme.cardStyle"
          >
            <div
              class="
                absolute top-5 left-5 rounded-full border px-3 py-1 text-sm
                sm:top-7 sm:left-7
              "
              :style="theme.accentStyle"
            >
              definition
            </div>

            <div
              class="grid h-full gap-5"
              :class="[
                hasDefinitionImage
                  ? `
                    pt-10 pb-0
                    sm:pb-10
                    lg:grid-cols-[minmax(0,1.1fr)_minmax(16rem,0.9fr)]
                  `
                  : 'place-items-center text-center',
              ]"
            >
              <div
                class="flex flex-col gap-4"
                :class="
                  hasDefinitionImage
                    ? 'justify-center'
                    : 'max-w-3xl items-center justify-center'
                "
              >
                <div>
                  <h3
                    class="
                      text-4xl/tight font-semibold text-highlighted
                      sm:text-5xl
                      lg:text-6xl
                    "
                  >
                    {{ card.definition }}
                  </h3>
                </div>
              </div>

              <div
                v-if="hasDefinitionImage"
                class="overflow-hidden rounded-[1.5rem] border p-2"
                :style="theme.imageFrameStyle"
              >
                <img
                  :src="card.definitionImage!.src"
                  :alt="card.definitionImage!.name || card.definition"
                  class="
                    size-full max-h-72 rounded-[1.25rem] object-cover
                    sm:max-h-88
                  "
                >
              </div>
            </div>
          </article>
        </div>
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { ICardDetailsResponse } from "~/repository/cards";
import { buildFlashcardTheme } from "~/utils/cardLearning";

const props = defineProps<{
  card: ICardDetailsResponse;
  currentPosition: number;
  currentCardTime: string;
  flipped: boolean;
  editLink: string;
}>();

defineEmits<{
  flip: [];
}>();

const { isSupported, isSpeaking, speak, stop } = useCardSpeech();

const theme = computed(() => buildFlashcardTheme(props.card));
const hasTermImage = computed(() => Boolean(props.card.termImage));
const hasDefinitionImage = computed(() => Boolean(props.card.definitionImage));

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

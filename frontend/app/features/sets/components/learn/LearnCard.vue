<template>
  <article
    class="
      app-radius-surface relative flex size-full flex-col overflow-hidden border
      border-default bg-elevated text-highlighted shadow-sm
    "
    :aria-label="badge"
  >
    <span
      class="
        pointer-events-none absolute top-0 right-0 size-0 border-t-[1.5rem]
        border-l-[1.5rem] border-l-transparent
      "
      :class="
        side === 'definition'
          ? 'border-t-emerald-500/80'
          : `border-t-sky-500/80`
      "
      aria-hidden="true"
    />

    <div
      class="
        flex min-h-0 flex-1 flex-col p-4
        sm:p-5
      "
    >
      <div class="flex min-h-0 flex-1 flex-col">
        <div
          v-if="image"
          class="mb-3 flex min-h-0 w-full flex-3 items-center justify-center"
        >
          <img
            :src="image.src"
            :alt="image.name"
            class="app-radius-surface h-full max-w-full object-contain"
            @load="fit"
          >
        </div>

        <div
          ref="regionRef"
          class="
            flex min-h-0 w-full flex-col items-center justify-center
            overflow-hidden
          "
          :class="image ? 'flex-2' : 'flex-1'"
        >
          <div
            ref="contentRef"
            class="w-full"
          >
            <h3
              ref="titleRef"
              class="
                mx-auto max-w-2xl text-center leading-[1.15] font-semibold
                wrap-anywhere whitespace-pre-wrap
              "
            >
              {{ title }}
            </h3>
            <p
              v-if="description"
              ref="descRef"
              class="
                mx-auto mt-3 max-w-xl text-center text-[0.44em] leading-[1.4]
                wrap-anywhere whitespace-pre-wrap opacity-70
              "
            >
              {{ description }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { IFileResponse } from "~/types/api.generated";

const { badge, title, description, image, side } = defineProps<{
  badge: string;
  title: string;
  description: string | null;
  image: IFileResponse | null;
  side: "term" | "definition";
}>();

const { regionRef, contentRef, titleRef, descRef, fit } = useFitText({
  minPx: 15,
  maxPx: 42,
  lineHeightRatio: 1.15,
});
</script>

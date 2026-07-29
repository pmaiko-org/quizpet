<template>
  <article
    class="
      app-radius-surface flex min-h-60 w-full flex-col overflow-hidden border
      border-default bg-elevated text-highlighted shadow-sm
      sm:min-h-80
    "
    :aria-label="badge"
  >
    <div
      class="
        flex min-h-0 flex-1 flex-col p-3
        sm:p-4
      "
    >
      <span
        class="
          app-radius-control w-fit border border-current/15 px-2.5 py-1 text-xs
          font-medium opacity-65
        "
      >
        {{ badge }}
      </span>

      <div class="flex flex-1 flex-col items-center justify-center py-3">
        <div
          v-if="image"
          class="app-radius-surface mb-4 h-36 w-full max-w-lg overflow-hidden"
        >
          <img
            :src="image.src"
            :alt="image.name"
            class="size-full object-cover"
          >
        </div>

        <h3
          class="
            mx-auto max-w-2xl text-center font-semibold wrap-anywhere
            whitespace-pre-wrap
          "
          :class="titleClass"
        >
          {{ title }}
        </h3>
        <p
          v-if="description"
          class="
            mx-auto mt-3 max-w-xl text-center wrap-anywhere whitespace-pre-wrap
            opacity-70
          "
          :class="descriptionClass"
        >
          {{ description }}
        </p>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { IFileResponse } from "~/types/api.generated";

const {
  title,
  description,
} = defineProps<{
  badge: string;
  title: string;
  description: string | null;
  image: IFileResponse | null;
}>();

const titleClass = computed(() => {
  const length = title.trim().length;

  if (length > 260) {
    return "text-base/6 sm:text-lg/7";
  }

  if (length > 140) {
    return "text-lg/7 sm:text-xl/8";
  }

  if (length > 72) {
    return "text-xl/7 sm:text-2xl/8";
  }

  return "text-2xl/8 sm:text-3xl/10 lg:text-4xl/12";
});

const descriptionClass = computed(() => {
  return description && description.length > 220
    ? "text-xs/5 sm:text-sm/6"
    : "text-sm/6 sm:text-base/7";
});
</script>

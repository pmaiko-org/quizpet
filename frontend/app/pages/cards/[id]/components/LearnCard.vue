<template>
  <article
    class="
      absolute inset-0 overflow-hidden rounded-2xl border border-default p-2
      text-center backface-hidden
      md:p-4
    "
    :class="image ? 'text-left' : 'text-center'"
  >
    <UBadge
      color="neutral"
      variant="outline"
      class="
        absolute top-2 right-2 opacity-50
        md:top-4 md:right-auto md:left-4
      "
    >
      {{ badge }}
    </UBadge>

    <div
      class="
        flex size-full flex-col justify-center gap-4
        md:flex-row
      "
    >
      <div
        class="
          flex min-w-0 flex-col
          md:justify-center md:py-12
        "
      >
        <h3
          class="
            line-clamp-6 py-3 text-2xl/tight font-semibold wrap-break-word
            text-highlighted
            md:text-5xl
          "
        >
          {{ title }}
        </h3>
        <p
          v-if="description"
          class="
            line-clamp-3 text-xs/tight opacity-75
            md:text-sm
          "
        >
          {{ description }}
        </p>
      </div>

      <div
        v-if="image"
        class="
          flex-1 overflow-hidden rounded-xl border border-default
          md:ml-auto md:max-w-5/12 md:flex-5/12 md:shrink-0
        "
      >
        <img
          :src="image.src"
          :alt="image.name"
          class="size-full object-cover"
        >
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { IFileResponse } from "~/types/api.generated";

defineProps<{
  badge: string;
  title: string;
  description: string | null;
  image: IFileResponse | null;
}>();
</script>

<template>
  <section
    class="
      relative flex flex-col items-center gap-6 overflow-hidden rounded-md
      border border-primary/25 bg-elevated/96 p-6 text-center shadow-sm
      sm:p-10
    "
  >
    <div
      class="
        pointer-events-none absolute -top-20 -right-16 size-52 rounded-full
        bg-primary/10 blur-2xl
      "
    />

    <span
      class="
        inline-flex items-center gap-2 rounded-full border border-primary/30
        bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary
      "
    >
      <span class="text-base">{{ question.emoji }}</span>
      {{ question.category }}
    </span>

    <h2
      class="
        max-w-2xl text-2xl font-semibold text-balance text-highlighted
        sm:text-3xl
      "
    >
      {{ question.text }}
    </h2>

    <p class="max-w-xl text-sm text-muted">
      {{ question.hint }}
    </p>

    <UButton
      color="primary"
      variant="solid"
      size="lg"
      icon="i-lucide-arrow-right-circle"
      trailing
      @click="emit('pass')"
    >
      Передати хід
    </UButton>
  </section>
</template>

<script setup lang="ts">
import type { TPitanyachkaQuestion } from "../types";

const { question } = defineProps<{
  question: TPitanyachkaQuestion;
}>();

const emit = defineEmits<{
  pass: [];
}>();
</script>

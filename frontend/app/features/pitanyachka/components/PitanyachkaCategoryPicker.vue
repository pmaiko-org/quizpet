<template>
  <section
    class="
      flex flex-col items-center gap-6 rounded-md border border-default
      bg-elevated/96 p-6 text-center shadow-sm
      sm:p-10
    "
  >
    <div class="space-y-2">
      <h2 class="text-2xl font-semibold text-highlighted">
        Оберіть категорію
      </h2>
      <p class="max-w-md text-sm text-muted">
        Питання під час гри будуть лише з обраної категорії. «Всі категорії» —
        грати з усіма питаннями одразу.
      </p>
    </div>

    <div class="flex w-full max-w-2xl flex-wrap justify-center gap-2">
      <button
        type="button"
        class="
          inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm
          font-medium transition-colors
        "
        :class="
          selected === null
            ? 'border-primary/50 bg-primary/10 text-primary'
            : `
              border-default bg-muted/40 text-toned
              hover:border-primary/30
            `
        "
        @click="selected = null"
      >
        <UIcon
          name="i-lucide-layers"
          class="size-4"
        />
        Всі категорії
        <span class="text-xs text-muted">{{ totalCount }}</span>
      </button>

      <button
        v-for="category in categories"
        :key="category.name"
        type="button"
        class="
          inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm
          font-medium transition-colors
        "
        :class="
          selected === category.name
            ? 'border-primary/50 bg-primary/10 text-primary'
            : `
              border-default bg-muted/40 text-toned
              hover:border-primary/30
            `
        "
        @click="selected = category.name"
      >
        <span class="text-base">{{ category.emoji }}</span>
        {{ category.name }}
        <span class="text-xs text-muted">{{ category.count }}</span>
      </button>
    </div>

    <UButton
      color="primary"
      variant="solid"
      size="lg"
      icon="i-lucide-play"
      :disabled="disabled || !categories.length"
      @click="emit('start', selected)"
    >
      Почати гру
    </UButton>
  </section>
</template>

<script setup lang="ts">
import type { TPitanyachkaCategory } from "../types";

const { categories, disabled = false } = defineProps<{
  categories: TPitanyachkaCategory[];
  disabled?: boolean;
}>();

const emit = defineEmits<{
  start: [category: string | null];
}>();

const selected = ref<string | null>(null);

const totalCount = computed(() =>
  categories.reduce((sum, category) => sum + category.count, 0),
);
</script>

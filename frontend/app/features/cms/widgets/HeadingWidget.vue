<template>
  <section :class="align === 'center' ? 'text-center' : 'text-left'">
    <div :class="align === 'center' ? 'mx-auto max-w-4xl' : ''">
      <p
        v-if="eyebrow"
        class="text-sm font-semibold tracking-wider text-primary uppercase"
      >
        {{ eyebrow }}
      </p>
      <h1
        class="
          mt-2 text-4xl font-semibold tracking-tight text-highlighted
          sm:text-5xl
        "
      >
        {{ title }}
      </h1>
      <p
        v-if="summary"
        class="mt-4 text-lg text-toned"
      >
        {{ summary }}
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
const { eyebrow, title, summary, align } = defineProps<{
  eyebrow?: string | null;
  title: string;
  summary?: string | null;
  align: "left" | "center";
}>();
</script>

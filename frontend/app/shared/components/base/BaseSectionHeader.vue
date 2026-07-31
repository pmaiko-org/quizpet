<template>
  <div
    class="
      flex flex-col gap-1.5
      sm:flex-row sm:items-end sm:justify-between sm:gap-4
    "
  >
    <BaseSectionIntro
      :eyebrow="eyebrow"
      :title="title"
      titleTag="h2"
      size="section"
    />

    <p
      v-if="summary"
      class="
        max-w-xl text-sm/5 text-toned
        sm:text-right
      "
    >
      {{ summary }}
    </p>

    <slot name="summary" />
  </div>
</template>

<script setup lang="ts">
interface IBaseSectionHeaderProps {
  eyebrow: string;
  title: string;
  summary?: string;
}

const { eyebrow, title, summary = "" } = defineProps<IBaseSectionHeaderProps>();
</script>

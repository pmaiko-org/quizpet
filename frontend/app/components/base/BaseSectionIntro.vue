<template>
  <div :class="containerClass">
    <p
      class="
        text-[0.6875rem]/4 font-bold tracking-[0.18em] text-primary uppercase
      "
    >
      {{ eyebrow }}
    </p>

    <component
      :is="titleTag"
      :class="titleClass"
    >
      {{ title }}
    </component>

    <p
      v-if="description"
      class="
        max-w-2xl text-sm/6 text-toned
        sm:text-[0.9375rem]/6
      "
    >
      {{ description }}
    </p>

    <slot />
  </div>
</template>

<script setup lang="ts">
interface IBaseSectionIntroProps {
  eyebrow: string;
  title: string;
  description?: string;
  titleTag?: "h1" | "h2" | "h3";
  size?: "section" | "hero";
}

const {
  eyebrow,
  title,
  description = "",
  titleTag = "h2",
  size = "hero",
} = defineProps<IBaseSectionIntroProps>();

const containerClass = computed(() => {
  return size === "hero" ? "space-y-2.5" : "space-y-1.5";
});

const titleClass = computed(() => {
  return size === "hero"
    ? "text-2xl/tight font-semibold text-highlighted sm:text-3xl/tight"
    : "text-xl/tight font-semibold text-highlighted sm:text-2xl/tight";
});
</script>

<template>
  <section
    class="
      relative overflow-hidden rounded-md border border-default bg-elevated/96
      p-5 shadow-sm
      sm:p-6
    "
  >
    <div
      class="
        pointer-events-none absolute inset-y-0 left-0 w-1 bg-primary opacity-85
      "
    />
    <div
      class="
        pointer-events-none absolute -top-18 -right-16 size-48 rounded-full
        bg-primary/8 blur-2xl
      "
    />

    <div
      :class="layoutClass"
      :aria-busy="pending"
    >
      <div class="min-w-0 space-y-4">
        <div
          v-if="pending"
          class="space-y-3"
        >
          <USkeleton class="h-3 w-32" />
          <div class="space-y-2">
            <USkeleton class="h-8 w-full max-w-xl" />
            <USkeleton class="h-8 w-3/4 max-w-md" />
          </div>
          <div class="space-y-2">
            <USkeleton class="h-4 w-full max-w-2xl" />
            <USkeleton class="h-4 w-4/5 max-w-xl" />
          </div>
        </div>

        <BaseSectionIntro
          v-else
          :eyebrow="eyebrow"
          :title="title"
          :description="description"
          :titleTag="titleTag"
          size="hero"
        />

        <div
          v-if="$slots.default"
          class="space-y-3"
        >
          <slot />
        </div>
      </div>

      <div
        v-if="$slots.aside"
        class="min-w-0"
      >
        <slot name="aside" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface IBaseHeroSectionProps {
  eyebrow: string;
  title: string;
  description?: string;
  titleTag?: "h1" | "h2" | "h3";
  pending?: boolean;
}

const {
  eyebrow,
  title,
  description = "",
  titleTag = "h1",
  pending = false,
} = defineProps<IBaseHeroSectionProps>();

const slots = useSlots();

const layoutClass = computed(() => {
  return slots.aside
    ? "grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(17rem,0.58fr)] lg:items-center"
    : "space-y-4";
});
</script>

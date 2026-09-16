<template>
  <section
    class="
      flex flex-col items-center gap-6 rounded-md border border-default
      bg-elevated/96 p-6 text-center shadow-sm
      sm:p-10
    "
  >
    <div
      class="
        flex size-16 items-center justify-center rounded-full bg-primary/10
        text-primary
      "
    >
      <UIcon
        :name="icon"
        class="size-8"
      />
    </div>

    <div class="space-y-2">
      <h2 class="text-2xl font-semibold text-highlighted">
        {{ title }}
      </h2>
      <p
        v-if="description"
        class="max-w-md text-sm text-muted"
      >
        {{ description }}
      </p>
    </div>

    <slot />
  </section>
</template>

<script setup lang="ts">
const {
  icon,
  title,
  description = "",
} = defineProps<{
  icon: string;
  title: string;
  description?: string;
}>();
</script>

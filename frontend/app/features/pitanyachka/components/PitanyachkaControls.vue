<template>
  <section
    class="
      flex flex-col gap-3 rounded-md border border-default bg-elevated/96 p-4
      shadow-sm
      sm:flex-row sm:items-center sm:justify-between
    "
  >
    <div class="flex items-center gap-3">
      <span
        class="flex items-center gap-2 text-sm font-medium"
        :class="connected ? 'text-primary' : 'text-muted'"
      >
        <span
          class="size-2 rounded-full"
          :class="connected ? 'bg-primary' : 'bg-muted'"
        />
        {{ connected ? "На звʼязку" : "Підключення…" }}
      </span>

      <span class="flex items-center gap-1.5 text-sm text-muted">
        <UIcon
          name="i-lucide-users"
          class="size-4"
        />
        {{ playersCount }}
      </span>

      <span class="flex items-center gap-1.5 text-sm text-muted">
        <UIcon
          name="i-lucide-help-circle"
          class="size-4"
        />
        {{ remaining }} / {{ total }}
      </span>
    </div>

    <div class="flex items-center gap-2">
      <UButton
        color="primary"
        variant="solid"
        icon="i-lucide-play"
        :disabled="!connected"
        @click="emit('start')"
      >
        {{ started ? "Почати заново" : "Старт" }}
      </UButton>

      <UButton
        color="neutral"
        variant="soft"
        icon="i-lucide-rotate-ccw"
        :disabled="!connected"
        @click="emit('reset')"
      >
        Скинути
      </UButton>
    </div>
  </section>
</template>

<script setup lang="ts">
const {
  connected = false,
  started = false,
  playersCount,
  remaining,
  total,
} = defineProps<{
  connected?: boolean;
  started?: boolean;
  playersCount: number;
  remaining: number;
  total: number;
}>();

const emit = defineEmits<{
  start: [];
  reset: [];
}>();
</script>

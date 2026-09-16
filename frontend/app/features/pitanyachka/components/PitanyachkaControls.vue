<template>
  <section
    class="
      flex flex-col gap-3 rounded-md border border-default bg-elevated/96 p-4
      shadow-sm
      sm:flex-row sm:items-center sm:justify-between
    "
  >
    <div class="flex flex-wrap items-center gap-3">
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

      <span
        v-if="started"
        class="flex items-center gap-1.5 text-sm text-muted"
      >
        <UIcon
          name="i-lucide-help-circle"
          class="size-4"
        />
        {{ remaining }} / {{ total }}
      </span>

      <span
        v-if="started"
        class="
          inline-flex items-center gap-1.5 rounded-full border border-primary/30
          bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary
        "
      >
        <UIcon
          name="i-lucide-tag"
          class="size-3.5"
        />
        {{ categoryLabel ?? "Всі категорії" }}
      </span>
    </div>

    <UButton
      v-if="started"
      color="neutral"
      variant="soft"
      icon="i-lucide-rotate-ccw"
      :disabled="!connected"
      @click="emit('restart')"
    >
      Почати заново
    </UButton>
  </section>
</template>

<script setup lang="ts">
const {
  connected = false,
  started = false,
  playersCount,
  remaining,
  total,
  categoryLabel = null,
} = defineProps<{
  connected?: boolean;
  started?: boolean;
  playersCount: number;
  remaining: number;
  total: number;
  categoryLabel?: string | null;
}>();

const emit = defineEmits<{
  restart: [];
}>();
</script>

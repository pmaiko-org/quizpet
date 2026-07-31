<template>
  <template v-if="pending">
    <slot name="loading">
      <div
        class="
          grid gap-4
          sm:grid-cols-2
          lg:grid-cols-3
        "
      >
        <div
          v-for="i in skeletonCount"
          :key="i"
          class="rounded-md border border-default bg-default/80 p-6 shadow-sm"
        >
          <div class="space-y-3">
            <USkeleton class="h-4 w-24" />
            <USkeleton class="h-7 w-2/3" />
            <USkeleton class="h-4 w-5/6" />
          </div>
        </div>
      </div>
    </slot>
  </template>

  <template v-else-if="error">
    <slot name="error">
      <div class="rounded-md border border-error/30 bg-error/5 p-6">
        <div
          class="
            flex flex-col gap-4
            sm:flex-row sm:items-center sm:justify-between
          "
        >
          <div class="space-y-2">
            <p
              class="text-sm font-medium tracking-[0.2em] text-error uppercase"
            >
              Помилка
            </p>
            <h3 class="text-xl font-semibold text-highlighted">
              {{ errorTitle }}
            </h3>
            <p
              v-if="errorDescription"
              class="max-w-2xl text-sm/6 text-toned"
            >
              {{ errorDescription }}
            </p>
          </div>

          <UButton
            icon="i-lucide-refresh-cw"
            color="error"
            variant="soft"
            size="lg"
            @click="emit('retry')"
          >
            {{ retryLabel }}
          </UButton>
        </div>
      </div>
    </slot>
  </template>

  <template v-else-if="empty">
    <slot name="empty" />
  </template>

  <template v-else>
    <slot />
  </template>
</template>

<script setup lang="ts">
const {
  pending = false,
  error = null,
  empty = false,
  errorTitle = "Не вдалося завантажити дані",
  errorDescription = "",
  retryLabel = "Спробувати знову",
  skeletonCount = 4,
} = defineProps<{
  pending?: boolean;
  error?: unknown;
  empty?: boolean;
  errorTitle?: string;
  errorDescription?: string;
  retryLabel?: string;
  skeletonCount?: number;
}>();

const emit = defineEmits<{
  retry: [];
}>();
</script>

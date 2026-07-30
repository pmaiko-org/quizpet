<template>
  <section class="space-y-3">
    <BaseSectionHeader
      eyebrow="Набори"
      title="Ваша колекція карток"
      :summary="summaryText"
    />

    <BaseDataBoundary
      :pending="pending"
      :error="error"
      :empty="!sets.length"
      errorTitle="Не вдалося завантажити набори"
      errorDescription="Спробуйте ще раз. Якщо проблема повторюється, варто перевірити доступність бекенду."
      @retry="emit('refresh')"
    >
      <template #loading>
        <div
          class="
            grid gap-3
            lg:grid-cols-2
          "
        >
          <div
            v-for="index in 4"
            :key="index"
            class="app-surface app-radius-surface p-5"
          >
            <div class="space-y-4">
              <div class="flex items-start justify-between gap-3">
                <div class="flex-1 space-y-2">
                  <USkeleton class="h-3 w-24" />
                  <USkeleton class="h-7 w-2/3" />
                </div>
                <USkeleton class="size-9 shrink-0" />
              </div>

              <div class="space-y-2">
                <USkeleton class="h-4 w-full" />
                <USkeleton class="h-4 w-5/6" />
              </div>

              <div class="flex gap-2">
                <USkeleton class="h-6 w-20" />
                <USkeleton class="h-6 w-24" />
              </div>

              <div
                class="
                  app-radius-surface grid grid-cols-3 gap-3 border
                  border-default bg-muted/45 p-3
                "
              >
                <div
                  v-for="metric in 3"
                  :key="metric"
                  class="space-y-2"
                >
                  <USkeleton class="h-3 w-10" />
                  <USkeleton class="h-5 w-8" />
                </div>
              </div>

              <div class="flex items-center justify-between">
                <USkeleton class="h-10 w-32" />
                <div class="flex gap-2">
                  <USkeleton class="size-10" />
                  <USkeleton class="size-10" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>

      <template #empty>
        <div
          class="
            app-radius-surface border border-dashed border-default
            bg-elevated/55 p-6 text-center
          "
        >
          <div
            class="
              app-radius-surface mx-auto flex size-11 items-center
              justify-center bg-primary/10 text-primary
            "
          >
            <UIcon
              name="i-lucide-library"
              class="size-5"
            />
          </div>
          <h3 class="mt-4 text-xl font-semibold text-highlighted">
            Поки що тут немає наборів
          </h3>
          <p class="mx-auto mt-3 max-w-xl text-sm/6 text-toned">
            Почніть з першого набору: додайте тему, короткий опис і кілька
            карток, щоб бібліотека одразу виглядала живою.
          </p>
          <UButton
            to="/sets/create"
            icon="i-lucide-plus"
            size="lg"
            class="mt-5 justify-center"
          >
            Створити перший набір
          </UButton>
        </div>
      </template>

      <div
        class="
          grid gap-3
          lg:grid-cols-2
        "
      >
        <SetCard
          v-for="set in sets"
          :key="set.id"
          :set="set"
          :canDelete="canDelete(set)"
          :deleting="deletingId === set.id"
          @delete="emit('delete', $event)"
        />
      </div>
    </BaseDataBoundary>
  </section>
</template>

<script setup lang="ts">
import type { ISetListItemResponse } from "~/types/api.generated";

const {
  sets,
  summaryText,
  pending = false,
  error = null,
  deletingId = null,
  canDelete,
} = defineProps<{
  sets: ISetListItemResponse[];
  summaryText: string;
  pending?: boolean;
  error?: unknown;
  deletingId?: string | null;
  canDelete: (set: ISetListItemResponse) => boolean;
}>();

const emit = defineEmits<{
  refresh: [];
  delete: [set: ISetListItemResponse];
}>();
</script>

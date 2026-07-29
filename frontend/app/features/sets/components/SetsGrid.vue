<template>
  <section class="space-y-4">
    <div
      class="
        flex flex-col gap-2
        sm:flex-row sm:items-end sm:justify-between
      "
    >
      <div>
        <p class="text-sm font-medium tracking-[0.2em] text-primary uppercase">
          Набори
        </p>
        <h2 class="mt-1 text-2xl font-semibold text-highlighted">
          Ваша колекція карток
        </h2>
      </div>

      <p class="text-sm text-toned">
        {{ summaryText }}
      </p>
    </div>

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
            grid gap-4
            lg:grid-cols-2
          "
        >
          <div
            v-for="index in 4"
            :key="index"
            class="
              rounded-[1.75rem] border border-default bg-default/80 p-6
              shadow-sm
            "
          >
            <div class="animate-pulse space-y-4">
              <div class="h-4 w-24 rounded-full bg-default" />
              <div class="h-7 w-2/3 rounded-full bg-default" />
              <div class="space-y-2">
                <div class="h-4 rounded-full bg-default" />
                <div class="h-4 w-5/6 rounded-full bg-default" />
              </div>
              <div class="flex gap-2">
                <div class="h-8 w-24 rounded-full bg-default" />
                <div class="h-8 w-28 rounded-full bg-default" />
              </div>
            </div>
          </div>
        </div>
      </template>

      <template #empty>
        <div
          class="
            rounded-[1.75rem] border border-dashed border-default bg-default/60
            p-8 text-center shadow-sm
          "
        >
          <div
            class="
              mx-auto flex size-14 items-center justify-center rounded-2xl
              bg-primary/10 text-primary
            "
          >
            <UIcon
              name="i-lucide-library"
              class="size-7"
            />
          </div>
          <h3 class="mt-5 text-2xl font-semibold text-highlighted">
            Поки що тут немає наборів
          </h3>
          <p class="mx-auto mt-3 max-w-xl text-sm/6 text-toned">
            Почніть з першого набору: додайте тему, короткий опис і кілька
            карток, щоб бібліотека одразу виглядала живою.
          </p>
          <UButton
            to="/sets/create"
            icon="i-lucide-plus"
            size="xl"
            class="mt-6 justify-center"
          >
            Створити перший набір
          </UButton>
        </div>
      </template>

      <div
        class="
          grid gap-4
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

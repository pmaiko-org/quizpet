<template>
  <article
    class="
      group rounded-[1.75rem] border border-default bg-default/80 p-6 shadow-sm
      transition-all duration-200
      hover:-translate-y-0.5 hover:shadow-md
    "
  >
    <div class="flex items-start justify-between gap-4">
      <div class="space-y-3">
        <p class="text-sm font-medium tracking-[0.2em] text-primary uppercase">
          Набір карток
        </p>
        <h3 class="text-2xl font-semibold text-highlighted">
          {{ set.name }}
        </h3>
      </div>

      <div
        class="
          flex size-11 items-center justify-center rounded-2xl bg-primary/10
          text-primary transition-colors
          group-hover:bg-primary group-hover:text-inverted
        "
      >
        <UIcon
          name="i-lucide-layers-3"
          class="size-5"
        />
      </div>
    </div>

    <p class="mt-4 line-clamp-3 min-h-18 text-sm/6 text-toned">
      {{
        set.description
          || "Опис ще не доданий, але набір уже готовий до наповнення."
      }}
    </p>

    <div class="mt-5 flex flex-wrap gap-2">
      <UBadge
        v-for="topic in set.topics"
        :key="topic.id"
        variant="soft"
        color="primary"
        size="lg"
        class="rounded-full px-3 py-1"
      >
        <span class="flex items-center gap-2">
          <UIcon
            :name="topic.icon"
            class="size-4"
          />
          {{ topic.label }}
        </span>
      </UBadge>

      <UBadge
        v-if="!set.topics.length"
        variant="outline"
        color="neutral"
        size="lg"
        class="rounded-full px-3 py-1"
      >
        Без тематики
      </UBadge>
    </div>

    <div class="mt-6 rounded-2xl border border-default bg-default/70 p-4">
      <div
        class="
          grid gap-4
          sm:grid-cols-3 sm:gap-6
        "
      >
        <div>
          <p class="text-sm text-toned">
            Карток у наборі
          </p>
          <p class="text-lg font-semibold text-highlighted">
            {{ set.cardsCount }}
          </p>
        </div>

        <div>
          <p class="text-sm text-toned">
            Тем у наборі
          </p>
          <p class="text-lg font-semibold text-highlighted">
            {{ set.topics.length }}
          </p>
        </div>

        <div>
          <p class="text-sm text-toned">
            Створив
          </p>
          <p class="text-lg font-semibold text-highlighted">
            {{ getAuthorName(set) }}
          </p>
        </div>
      </div>
    </div>

    <div
      class="
        mt-4 flex flex-col gap-3
        sm:flex-row sm:justify-between
      "
    >
      <div class="flex flex-wrap gap-2">
        <UButton
          :to="`/sets/${set.id}/learn`"
          icon="i-lucide-graduation-cap"
          size="lg"
        >
          Вчитись
        </UButton>

        <UButton
          to="/sets/create"
          variant="outline"
          color="neutral"
          icon="i-lucide-plus"
          size="lg"
        >
          Новий набір
        </UButton>

        <UButton
          v-if="canDelete"
          :to="`/sets/${set.id}/edit`"
          variant="outline"
          color="primary"
          icon="i-lucide-pencil"
          size="lg"
        >
          Редагувати
        </UButton>
      </div>

      <UButton
        v-if="canDelete"
        :loading="deleting"
        color="error"
        variant="ghost"
        icon="i-lucide-trash-2"
        size="lg"
        @click="emit('delete', set)"
      >
        Видалити
      </UButton>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { ISetListItemResponse } from "~/types/api.generated";

import { getAuthorName } from "../utils";

const {
  set,
  canDelete = false,
  deleting = false,
} = defineProps<{
  set: ISetListItemResponse;
  canDelete?: boolean;
  deleting?: boolean;
}>();

const emit = defineEmits<{
  delete: [set: ISetListItemResponse];
}>();
</script>

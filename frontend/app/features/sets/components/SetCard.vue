<template>
  <article
    class="
      group flex min-h-0 flex-col rounded-md border border-default
      bg-elevated/96 p-4 shadow-sm transition-all duration-200
      hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-md
      sm:p-5
    "
  >
    <div class="flex items-start justify-between gap-3">
      <div class="min-w-0 space-y-1.5">
        <p
          class="
            text-[0.6875rem]/4 font-bold tracking-[0.18em] text-primary
            uppercase
          "
        >
          Набір карток
        </p>
        <h3 class="truncate text-xl font-semibold text-highlighted">
          {{ set.name }}
        </h3>
      </div>

      <div
        class="
          flex size-9 shrink-0 items-center justify-center rounded-md
          bg-primary/10 text-primary transition-colors
          group-hover:bg-primary group-hover:text-inverted
        "
      >
        <UIcon
          name="i-lucide-layers-3"
          class="size-4.5"
        />
      </div>
    </div>

    <p class="mt-3 line-clamp-2 min-h-10 text-sm/5 text-toned">
      {{
        set.description
          || "Опис ще не доданий, але набір уже готовий до наповнення."
      }}
    </p>

    <div class="mt-3 flex flex-wrap gap-1.5">
      <UBadge
        v-for="topic in set.topics"
        :key="topic.id"
        variant="soft"
        color="primary"
        size="md"
        class="rounded-full px-2.5 py-0.5"
      >
        <span class="flex items-center gap-1.5">
          <UIcon
            :name="topic.icon"
            class="size-3.5"
          />
          {{ topic.label }}
        </span>
      </UBadge>

      <UBadge
        v-if="!set.topics.length"
        variant="outline"
        color="neutral"
        size="md"
        class="rounded-full px-2.5 py-0.5"
      >
        Без тематики
      </UBadge>
    </div>

    <div class="mt-4 rounded-md border border-default bg-muted/45 p-3">
      <div class="grid grid-cols-3 gap-3">
        <div>
          <p
            class="
              text-[10px] font-semibold tracking-widest text-muted uppercase
            "
          >
            Карток
          </p>
          <p class="mt-0.5 text-base font-semibold text-highlighted">
            {{ set.cardsCount }}
          </p>
        </div>

        <div>
          <p
            class="
              text-[10px] font-semibold tracking-widest text-muted uppercase
            "
          >
            Тем
          </p>
          <p class="mt-0.5 text-base font-semibold text-highlighted">
            {{ set.topics.length }}
          </p>
        </div>

        <div class="min-w-0">
          <p
            class="
              text-[10px] font-semibold tracking-widest text-muted uppercase
            "
          >
            Створив
          </p>
          <p class="mt-0.5 truncate text-sm font-semibold text-highlighted">
            {{ getAuthorName(set) }}
          </p>
        </div>
      </div>
    </div>

    <div class="mt-4 flex items-center justify-between gap-2">
      <UButton
        :to="{ name: RouteName.SETS_ID_LEARN, params: { id: set.id } }"
        icon="i-lucide-play"
        size="lg"
        class="min-w-32 justify-center"
      >
        Вчитись
      </UButton>

      <div
        v-if="canDelete"
        class="flex items-center gap-1"
      >
        <UButton
          :to="{ name: RouteName.SETS_ID_EDIT, params: { id: set.id } }"
          variant="ghost"
          color="neutral"
          icon="i-lucide-pencil"
          size="lg"
          aria-label="Редагувати набір"
        />
        <UButton
          :loading="deleting"
          color="error"
          variant="ghost"
          icon="i-lucide-trash-2"
          size="lg"
          aria-label="Видалити набір"
          @click="emit('delete', set)"
        />
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { RouteName } from "~/constants";
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

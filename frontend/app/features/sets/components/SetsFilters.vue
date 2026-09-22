<template>
  <div class="rounded-md border border-default bg-elevated/70 p-4 shadow-xs">
    <div class="flex items-center justify-between gap-3">
      <div>
        <p class="text-sm font-semibold text-highlighted">
          Фільтри
        </p>
        <p class="mt-0.5 text-xs text-toned">
          Звузьте бібліотеку за потрібними параметрами.
        </p>
      </div>

      <UButton
        v-if="hasActiveFilters"
        type="button"
        color="neutral"
        variant="ghost"
        size="sm"
        icon="i-lucide-rotate-ccw"
        @click="emit('clear')"
      >
        Очистити
      </UButton>
    </div>

    <div :class="filtersGridClass">
      <UFormField label="Назва набору">
        <UInput
          v-model="search"
          icon="i-lucide-search"
          placeholder="Знайти набір"
          class="w-full"
        />
      </UFormField>

      <UFormField label="Тематика">
        <USkeleton
          v-if="!optionsReady"
          class="h-8 w-full"
        />

        <USelectMenu
          v-else
          v-model="topicIds"
          :items="topics"
          labelKey="label"
          valueKey="id"
          placeholder="Усі тематики"
          :searchInput="{ placeholder: 'Знайти тематику' }"
          :multiple="true"
          class="w-full"
        >
          <template #item-leading="{ item }">
            <UIcon
              :name="item.icon"
              class="size-4 text-primary"
            />
          </template>
        </USelectMenu>
      </UFormField>

      <UFormField label="Рівень англійської">
        <USkeleton
          v-if="!optionsReady"
          class="h-8 w-full"
        />

        <USelectMenu
          v-else
          v-model="englishLevelIds"
          :items="englishLevels"
          labelKey="label"
          valueKey="id"
          placeholder="Усі рівні"
          :searchInput="{ placeholder: 'Знайти рівень' }"
          :multiple="true"
          class="w-full"
        />
      </UFormField>

      <UFormField
        v-if="scope === 'all'"
        label="Автор"
      >
        <USkeleton
          v-if="!optionsReady"
          class="h-8 w-full"
        />

        <USelectMenu
          v-else
          v-model="authorIds"
          :items="authors"
          labelKey="label"
          valueKey="id"
          placeholder="Усі автори"
          :searchInput="{ placeholder: 'Знайти автора' }"
          :multiple="true"
          class="w-full"
        />
      </UFormField>
    </div>

    <div
      v-if="optionsError"
      class="mt-3 flex items-center justify-between gap-3 text-sm text-error"
    >
      <span>Не вдалося завантажити параметри фільтрів.</span>
      <UButton
        type="button"
        color="error"
        variant="link"
        size="sm"
        class="px-0"
        @click="emit('retryOptions')"
      >
        Повторити
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import type {
  IEnglishLevelResponse,
  ITopicResponse,
} from "~/shared/types/api.generated";

import type { ISetAuthorOption, TSetListScope } from "../types";

const {
  scope,
  topics,
  englishLevels,
  authors,
  hasActiveFilters = false,
  optionsReady = false,
  optionsError = null,
} = defineProps<{
  scope: TSetListScope;
  topics: ITopicResponse[];
  englishLevels: IEnglishLevelResponse[];
  authors: ISetAuthorOption[];
  hasActiveFilters?: boolean;
  optionsReady?: boolean;
  optionsError?: unknown;
}>();

const search = defineModel<string>("search", { required: true });
const topicIds = defineModel<string[]>("topicIds", { required: true });
const englishLevelIds = defineModel<string[]>("englishLevelIds", {
  required: true,
});
const authorIds = defineModel<string[]>("authorIds", { required: true });

const filtersGridClass = computed(() => [
  "mt-4 grid gap-3 sm:grid-cols-2",
  scope === "mine" ? "xl:grid-cols-3" : "xl:grid-cols-4",
]);

const emit = defineEmits<{
  clear: [];
  retryOptions: [];
}>();
</script>

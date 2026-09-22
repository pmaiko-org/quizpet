<template>
  <section class="space-y-3">
    <BaseSectionHeader
      eyebrow="Набори"
      :title="sectionTitle"
      :summary="summaryText"
    />

    <UTabs
      v-model="scope"
      :items="scopeTabs"
      :content="false"
      class="w-full"
      :ui="{ list: 'w-full sm:w-fit', trigger: 'flex-1 sm:flex-none' }"
    />

    <SetsFilters
      v-model:search="search"
      v-model:topicIds="topicIds"
      v-model:englishLevelIds="englishLevelIds"
      v-model:authorIds="authorIds"
      :scope="scope"
      :topics="topics"
      :englishLevels="englishLevels"
      :authors="authors"
      :hasActiveFilters="hasActiveFilters"
      :optionsReady="filterOptionsReady"
      :optionsError="filterOptionsError"
      @clear="emit('clearFilters')"
      @retryOptions="emit('retryFilterOptions')"
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
            class="
              rounded-md border border-default bg-elevated/96 p-5 shadow-sm
            "
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
                  grid grid-cols-3 gap-3 rounded-md border border-default
                  bg-muted/45 p-3
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
            rounded-md border border-dashed border-default bg-elevated/55 p-6
            text-center
          "
        >
          <div
            class="
              mx-auto flex size-11 items-center justify-center rounded-md
              bg-primary/10 text-primary
            "
          >
            <UIcon
              :name="
                hasActiveFilters ? 'i-lucide-search-x' : 'i-lucide-library'
              "
              class="size-5"
            />
          </div>
          <h3 class="mt-4 text-xl font-semibold text-highlighted">
            {{ emptyTitle }}
          </h3>
          <p class="mx-auto mt-3 max-w-xl text-sm/6 text-toned">
            {{ emptyDescription }}
          </p>
          <UButton
            v-if="hasActiveFilters"
            type="button"
            icon="i-lucide-rotate-ccw"
            size="lg"
            class="mt-5 justify-center"
            @click="emit('clearFilters')"
          >
            Очистити фільтри
          </UButton>
          <UButton
            v-else
            :to="{ name: RouteName.SETS_CREATE }"
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

    <BasePagination
      v-if="meta"
      v-model:page="page"
      :meta="meta"
      :disabled="pending"
    />
  </section>
</template>

<script setup lang="ts">
import type { TabsItem } from "@nuxt/ui";

import { RouteName } from "~/shared/constants";
import type {
  IEnglishLevelResponse,
  IPaginationMeta,
  ISetListItemResponse,
  ITopicResponse,
} from "~/shared/types/api.generated";

import type { ISetAuthorOption, TSetListScope } from "../types";

const {
  sets,
  meta = null,
  summaryText,
  pending = false,
  error = null,
  deletingId = null,
  canDelete,
  topics,
  englishLevels,
  authors,
  hasActiveFilters = false,
  filterOptionsReady = false,
  filterOptionsError = null,
} = defineProps<{
  sets: ISetListItemResponse[];
  meta?: IPaginationMeta | null;
  summaryText: string;
  pending?: boolean;
  error?: unknown;
  deletingId?: string | null;
  canDelete: (set: ISetListItemResponse) => boolean;
  topics: ITopicResponse[];
  englishLevels: IEnglishLevelResponse[];
  authors: ISetAuthorOption[];
  hasActiveFilters?: boolean;
  filterOptionsReady?: boolean;
  filterOptionsError?: unknown;
}>();

const page = defineModel<number>("page", { required: true });
const scope = defineModel<TSetListScope>("scope", { required: true });
const search = defineModel<string>("search", { required: true });
const topicIds = defineModel<string[]>("topicIds", { required: true });
const englishLevelIds = defineModel<string[]>("englishLevelIds", {
  required: true,
});
const authorIds = defineModel<string[]>("authorIds", { required: true });

const scopeTabs = [
  {
    label: "Мої набори",
    value: "mine",
    icon: "i-lucide-user-round",
  },
  {
    label: "Усі набори",
    value: "all",
    icon: "i-lucide-library",
  },
] satisfies Array<TabsItem & { value: TSetListScope }>;

const sectionTitle = computed(() =>
  scope.value === "mine" ? "Ваша колекція карток" : "Усі доступні картки",
);

const emptyTitle = computed(() =>
  hasActiveFilters
    ? "Нічого не знайдено"
    : scope.value === "mine"
      ? "У вас ще немає наборів"
      : "Поки що немає доступних наборів",
);

const emptyDescription = computed(() =>
  hasActiveFilters
    ? "Спробуйте змінити умови пошуку або очистити активні фільтри."
    : scope.value === "mine"
      ? "Створіть перший набір: додайте тему, короткий опис і кілька карток."
      : "Створіть перший набір, щоб він з’явився у спільній бібліотеці.",
);

const emit = defineEmits<{
  refresh: [];
  delete: [set: ISetListItemResponse];
  clearFilters: [];
  retryFilterOptions: [];
}>();
</script>

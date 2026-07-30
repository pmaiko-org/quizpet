<template>
  <UForm
    :schema="setSchema"
    :state="state"
    class="space-y-5 pb-20"
    @submit="onSubmit"
    @error="onError"
  >
    <section
      class="
        app-surface app-radius-surface p-5
        sm:p-6
      "
    >
      <div class="space-y-5">
        <div
          class="
            flex flex-col gap-3
            md:flex-row md:items-start md:justify-between
          "
        >
          <BaseSectionIntro
            :eyebrow="formEyebrow"
            :title="formTitle"
            :description="formDescription"
            titleTag="h1"
            size="hero"
          />

          <UBadge
            color="neutral"
            variant="soft"
            icon="i-lucide-cloud-check"
            class="w-fit shrink-0 rounded-full"
          >
            {{
              isEditMode
                ? "Зміни готові до збереження"
                : "Чернетка зберігається"
            }}
          </UBadge>
        </div>

        <div
          class="
            grid gap-4
            md:grid-cols-2
          "
        >
          <UFormField
            label="Назва набору"
            name="name"
            description="Коротка назва, яку легко впізнати."
            required
            size="lg"
          >
            <UInput
              v-model="state.name"
              size="lg"
              class="w-full"
              placeholder="Наприклад, Basic Biology"
            />
          </UFormField>

          <UFormField
            label="Тематика"
            name="topicIds"
            description="Оберіть щонайменше одну категорію."
            required
            size="lg"
          >
            <USkeleton
              v-if="topicsPending"
              class="h-10 w-full"
            />

            <div
              v-else-if="topicsError"
              class="
                app-radius-control flex items-center justify-between gap-3
                border border-error/25 bg-error/5 px-3 py-2
              "
            >
              <p class="text-sm text-error">
                Не вдалося завантажити тематики
              </p>
              <UButton
                type="button"
                color="error"
                variant="soft"
                size="sm"
                icon="i-lucide-refresh-cw"
                @click="loadTopics"
              >
                Повторити
              </UButton>
            </div>

            <USelectMenu
              v-else
              v-model="state.topicIds"
              :items="topics"
              labelKey="label"
              valueKey="id"
              :multiple="true"
              :searchInput="{ placeholder: 'Знайти тематику' }"
              size="lg"
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

          <UFormField
            label="Опис"
            name="description"
            description="Що саме допоможе вивчити цей набір."
            size="lg"
            class="md:col-span-2"
          >
            <UTextarea
              v-model="state.description"
              size="lg"
              autoresize
              :rows="2"
              class="w-full"
              placeholder="Коротко опишіть тему або навчальну мету"
            />
          </UFormField>
        </div>

        <div
          class="
            app-radius-surface flex items-start gap-3 border border-secondary/20
            bg-secondary/8 px-3 py-2.5 text-sm/5 text-toned
          "
        >
          <UIcon
            name="i-lucide-lightbulb"
            class="mt-0.5 size-4 shrink-0 text-secondary"
          />
          <p>
            Найкраще запам’ятовуються короткі картки: одна думка, одна відповідь
            і лише необхідний контекст.
          </p>
        </div>
      </div>
    </section>

    <section class="space-y-3">
      <div
        class="
          flex flex-col gap-1
          sm:flex-row sm:items-end sm:justify-between
        "
      >
        <BaseSectionIntro
          eyebrow="Наповнення"
          title="Картки набору"
          titleTag="h2"
          size="section"
        />
        <p class="text-sm text-toned">
          {{ state.cards.length }} картки
        </p>
      </div>

      <SetCsvTransfer
        :cards="state.cards"
        @import-cards="replaceCards"
      />

      <div class="space-y-3">
        <CardForm
          v-for="(card, index) in state.cards"
          :key="card.id || card.position"
          :modelValue="card"
          :index="index"
          :canRemove="state.cards.length > 2"
          :isFirst="index === 0"
          :isLast="index === state.cards.length - 1"
          @update:model-value="updateCard(index, $event)"
          @remove="removeCard(index)"
          @move-up="moveCard(index, index - 1)"
          @move-down="moveCard(index, index + 1)"
        />
      </div>
    </section>

    <div
      class="
        app-radius-surface sticky bottom-2 z-20 mx-auto grid w-full grid-cols-2
        gap-2 border border-default bg-elevated/92 p-2 shadow-(--app-shadow-md)
        backdrop-blur-xl
        sm:flex sm:w-fit sm:justify-end
      "
    >
      <UButton
        type="button"
        size="lg"
        variant="ghost"
        color="neutral"
        icon="i-lucide-plus"
        :disabled="submitting"
        class="justify-center"
        :class="!submitting && 'cursor-pointer'"
        @click="addCard"
      >
        Додати картку
      </UButton>

      <UButton
        type="submit"
        size="lg"
        :loading="submitting"
        class="
          justify-center
          sm:min-w-40
        "
        :class="!submitting && 'cursor-pointer'"
      >
        {{ submitLabel }}
      </UButton>
    </div>
  </UForm>
</template>

<script setup lang="ts">
import type { FormErrorEvent } from "#ui/types/form";
import type { ISetDetailsResponse } from "~/types/api.generated";

import {
  initialCard,
  initialSet,
  type TCardFormData,
  type TSetFormData,
} from "../types";
import { setSchema } from "../validation";

const { set } = defineProps<{
  set?: ISetDetailsResponse;
}>();

const SET_FORM_DRAFT_STORAGE_KEY = "cards:set-form-draft";

const { topics, topicsPending, topicsError, submitting, loadTopics, saveSet } =
  useSetForm();

const draft = useLocalStorage<string | null>(SET_FORM_DRAFT_STORAGE_KEY, null);

const isMounted = useMounted();

const createDraftSnapshot = (value: TSetFormData): string =>
  JSON.stringify(toRaw(value));

const getDraftSnapshot = (value: string): TSetFormData => {
  if (!isMounted.value) {
    return initialSet();
  }

  try {
    return JSON.parse(value) as TSetFormData;
  } catch {
    return initialSet();
  }
};

const getInitialState = () => {
  if (set) {
    return initialSet(set);
  }

  return draft.value ? getDraftSnapshot(draft.value) : initialSet();
};

const state = reactive<TSetFormData>(getInitialState());

onMounted(() => {
  Object.assign(state, {
    ...state,
    ...getInitialState(),
  });

  void loadTopics();
});

const isEditMode = computed(() => Boolean(state.id));
const formEyebrow = computed(() =>
  isEditMode.value ? "Редагування набору" : "Новий набір",
);
const formTitle = computed(() =>
  isEditMode.value ? "Оновити набір" : "Створити набір карток",
);
const formDescription = computed(() =>
  isEditMode.value
    ? "Змініть основні дані або відредагуйте окремі картки."
    : "Додайте тему, короткий опис і щонайменше дві картки.",
);
const submitLabel = computed(() =>
  isEditMode.value ? "Зберегти" : "Створити набір",
);

watch(
  state,
  (nextState) => {
    if (isEditMode.value) {
      return;
    }

    draft.value = createDraftSnapshot(nextState as TSetFormData);
  },
  { deep: true },
);

const syncCardPositions = () => {
  state.cards.forEach((card, index) => {
    card.position = index;
  });
};

const addCard = () => {
  state.cards.push(initialCard(state.cards.length));
  syncCardPositions();
};

const replaceCards = (cards: TCardFormData[]) => {
  state.cards.splice(0, state.cards.length, ...cards);
  syncCardPositions();
};

const removeCard = (index: number) => {
  state.cards.splice(index, 1);
  syncCardPositions();
};

const moveCard = (fromIndex: number, toIndex: number) => {
  if (toIndex < 0 || toIndex >= state.cards.length || fromIndex === toIndex) {
    return;
  }

  const [card] = state.cards.splice(fromIndex, 1);
  if (!card) {
    return;
  }

  state.cards.splice(toIndex, 0, card);
  syncCardPositions();
};

const updateCard = (index: number, card: TCardFormData) => {
  if (!state.cards[index]) {
    return;
  }

  state.cards[index] = card;
};

const onSubmit = async (event: {
  data: ReturnType<typeof setSchema.parse>;
}) => {
  const created = await saveSet(event.data, state.cards, state.id);

  if (created) {
    draft.value = null;
  }
};

const onError = async (event: FormErrorEvent) => {
  const firstErrorId = event.errors?.[0]?.id;

  if (!firstErrorId) {
    return;
  }

  await nextTick();
  const element = document.getElementById(firstErrorId);

  element?.scrollIntoView({
    behavior: "smooth",
    block: "center",
  });

  if (
    element instanceof HTMLInputElement ||
    element instanceof HTMLTextAreaElement
  ) {
    element.focus();
  }
};
</script>

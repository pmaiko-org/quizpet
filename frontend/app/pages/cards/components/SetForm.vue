<template>
  <UForm
    :schema="setSchema"
    :state="state"
    class="space-y-8"
    @submit="onSubmit"
    @error="onError"
  >
    <section
      class="
        rounded-4xl border border-default bg-default/80 p-6 shadow-sm
        sm:p-8
      "
    >
      <div
        class="
          grid gap-6
          xl:grid-cols-[minmax(0,1.3fr)_minmax(18rem,0.7fr)]
        "
      >
        <div class="space-y-5">
          <div class="space-y-2">
            <p
              class="
                text-sm font-medium tracking-[0.24em] text-primary uppercase
              "
            >
              {{ formEyebrow }}
            </p>
            <h2 class="text-3xl font-semibold text-highlighted">
              {{ formTitle }}
            </h2>
            <p class="max-w-2xl text-sm/6 text-toned">
              {{ formDescription }}
            </p>
          </div>

          <div
            class="
              grid gap-5
              md:grid-cols-2
            "
          >
            <UFormField
              label="Назва модуля"
              name="name"
              description="Користувачі побачать її у списку ваших наборів."
              required
              size="xl"
            >
              <UInput
                v-model="state.name"
                size="xl"
                class="w-full"
                placeholder="Наприклад, Basic Biology"
              />
            </UFormField>

            <UFormField
              v-if="topics"
              label="Тематика модуля"
              name="topics"
              description="Це допоможе зрозуміти, до якої сфери належить набір."
              required
              size="xl"
            >
              <USelectMenu
                v-model="state.topicIds"
                :items="topics"
                label-key="label"
                value-key="id"
                :multiple="true"
                :search-input="{ placeholder: 'Знайти тематику' }"
                size="xl"
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
          </div>

          <UFormField
            label="Опис"
            name="description"
            description="Короткий контекст допоможе швидше зрозуміти тему набору."
            size="xl"
          >
            <UTextarea
              v-model="state.description"
              size="xl"
              autoresize
              :rows="4"
              class="w-full"
              placeholder="Опишіть, для кого цей набір і що саме він покриває"
            />
          </UFormField>
        </div>

        <div
          class="
            rounded-[1.75rem] border border-default bg-linear-to-br
            from-primary/10 via-transparent to-success/10 p-6
          "
        >
          <p
            class="text-sm font-medium tracking-[0.24em] text-primary uppercase"
          >
            Порада
          </p>
          <h3 class="mt-3 text-xl font-semibold text-highlighted">
            Краще робити картки короткими
          </h3>
          <p class="mt-3 text-sm/6 text-toned">
            Один термін, одна думка, один візуальний акцент. Так набір читається
            швидше і краще працює на повторення.
          </p>

          <div
            class="
              mt-5 rounded-2xl border border-default bg-default/80 p-4 text-sm
              text-toned
            "
          >
            Для кольорів і зображень нижче використані базові компоненти з
            підтримкою помилок, світлої та темної теми.
          </div>
        </div>
      </div>
    </section>

    <section
      class="
        rounded-4xl border border-default bg-default/80 p-6 shadow-sm
        sm:p-8
      "
    >
      <SetCsvTransfer
        :cards="state.cards"
        class="mb-6"
        @import-cards="replaceCards"
      />

      <div
        class="
          mb-6 flex flex-col gap-4
          sm:flex-row sm:items-center sm:justify-between
        "
      >
        <div>
          <p
            class="text-sm font-medium tracking-[0.24em] text-primary uppercase"
          >
            Картки
          </p>
          <h2 class="mt-1 text-2xl font-semibold text-highlighted">
            Наповніть набір контентом
          </h2>
        </div>

        <UButton
          type="button"
          size="xl"
          variant="outline"
          icon="i-lucide-plus"
          class="justify-center"
          @click="addCard"
        >
          Додати картку
        </UButton>
      </div>

      <div class="space-y-4">
        <CardForm
          v-for="(card, index) in state.cards"
          :key="card.position"
          :model-value="card"
          :index="index"
          :can-remove="state.cards.length > 2"
          :is-first="index === 0"
          :is-last="index === state.cards.length - 1"
          @update:model-value="updateCard(index, $event)"
          @remove="removeCard(index)"
          @move-up="moveCard(index, index - 1)"
          @move-down="moveCard(index, index + 1)"
        />
      </div>
    </section>

    <div
      class="
        flex flex-col-reverse gap-3
        sm:flex-row sm:justify-end
      "
    >
      <UButton
        type="button"
        size="xl"
        variant="ghost"
        color="neutral"
        icon="i-lucide-plus"
        :disabled="submitting"
        @click="addCard"
      >
        Ще одна картка
      </UButton>

      <UButton
        type="submit"
        size="xl"
        :loading="submitting"
        class="justify-center"
      >
        {{ submitLabel }}
      </UButton>
    </div>
  </UForm>
</template>

<script setup lang="ts">
import { z } from "zod";
import { FetchError } from "ofetch";
import type { FormErrorEvent } from "#ui/types/form";
import type {
  ICreateSet,
  ISetDetailsResponse,
  ITopicResponse,
  IUpdateSet,
} from "~/types/api.generated";
import { fileSchema } from "~/validation";
import {
  type ICardFormData,
  initialCard,
  initialSet,
  type SetFormData,
} from "~/pages/cards/components/types";

const props = defineProps<{
  set?: ISetDetailsResponse;
}>();

const { $repository } = useNuxtApp();

const submitting = ref(false);

const topics = ref<ITopicResponse[] | null>(null);

onMounted(async () => {
  topics.value = await $repository.sets.getTopics();
});

const optionalHexColor = z.preprocess(
  value => (typeof value === "string" && !value.trim() ? undefined : value),
  z
    .string()
    .regex(/^#(?:[0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/)
    .optional(),
);

const cardSchema = z.object({
  position: z.number(),
  term: z.string().trim().min(1),
  termDescription: z.string().trim().min(1).or(z.literal("")).optional(),
  termImage: fileSchema.optional(),
  definition: z.string().trim().min(1),
  definitionImage: fileSchema.optional(),
  textColor: optionalHexColor,
  backgroundColor: optionalHexColor,
});

const setSchema = z.object({
  name: z.string().trim().min(2),
  topicIds: z.array(z.string().trim().min(1)).min(1),
  description: z.string().trim().max(280),
  cards: z.array(cardSchema).min(2),
});

const state = reactive<SetFormData>(initialSet(props.set));

watch(
  () => props.set,
  (nextSet) => {
    Object.assign(state, initialSet(nextSet));
  },
  { immediate: true },
);

const isEditMode = computed(() => Boolean(state.id));
const formEyebrow = computed(() =>
  isEditMode.value ? "Редагування набору" : "Новий набір",
);
const formTitle = computed(() =>
  isEditMode.value
    ? "Оновіть набір карток без втрати структури"
    : "Створіть набір карток з чистою структурою",
);
const formDescription = computed(() =>
  isEditMode.value
    ? "Оновіть назву, опис, тематики й картки. Існуючі картки збережуться та оновляться по id."
    : "Дайте модулю зрозумілу назву, коротко опишіть тему й додайте картки. Форма підтримує світлу та темну тему через стандартні токени Nuxt UI.",
);
const submitLabel = computed(() =>
  isEditMode.value ? "Зберегти зміни" : "Створити набір",
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

const replaceCards = (cards: ICardFormData[]) => {
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

const updateCard = (index: number, card: ICardFormData) => {
  if (!state.cards[index]) {
    return;
  }

  state.cards[index] = card;
};

const toast = useToast();

const router = useRouter();

const onSubmit = async (event: { data: z.output<typeof setSchema> }) => {
  const basePayload: ICreateSet = {
    name: event.data.name,
    description: event.data.description,
    topicIds: event.data.topicIds,
    cards: event.data.cards.map(card => ({
      position: card.position,
      term: card.term,
      termDescription: card.termDescription || null,
      termImageId: card.termImage?.id ?? null,
      definition: card.definition,
      definitionImageId: card.definitionImage?.id ?? null,
      textColor: card.textColor ?? null,
      backgroundColor: card.backgroundColor ?? null,
    })),
  };

  try {
    submitting.value = true;

    if (state.id) {
      const payload: IUpdateSet = {
        ...basePayload,
        cards: event.data.cards.map(card => ({
          id: state.cards[card.position]?.id ?? null,
          position: card.position,
          term: card.term,
          termDescription: card.termDescription || null,
          termImageId: card.termImage?.id ?? null,
          definition: card.definition,
          definitionImageId: card.definitionImage?.id ?? null,
          textColor: card.textColor ?? null,
          backgroundColor: card.backgroundColor ?? null,
        })),
      };

      await $repository.sets.updateSet(state.id, payload);
    } else {
      await $repository.sets.createSet(basePayload);
    }

    await router.push("/cards");
    toast.add({
      title: isEditMode.value ? "Набір оновлено" : "Набір створено",
      description: "",
    });
  } catch (error) {
    if (error instanceof FetchError) {
      console.log(error.data);
    }

    toast.add({
      title: "Помилка",
      description: "",
    });
  } finally {
    submitting.value = false;
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
    element instanceof HTMLInputElement
    || element instanceof HTMLTextAreaElement
  ) {
    element.focus();
  }
};
</script>

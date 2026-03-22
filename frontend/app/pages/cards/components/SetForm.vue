<template>
  <UForm
    :schema="setSchema"
    :state="state"
    class="space-y-8"
    @submit="onSubmit"
    @error="onError"
  >
    <section class="rounded-[2rem] border border-default bg-default/80 p-6 shadow-sm sm:p-8">
      <div class="grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(18rem,0.7fr)]">
        <div class="space-y-5">
          <div class="space-y-2">
            <p class="text-sm font-medium uppercase tracking-[0.24em] text-primary">
              Новий модуль
            </p>
            <h2 class="text-3xl font-semibold text-highlighted">
              Створіть набір карток з чистою структурою
            </h2>
            <p class="max-w-2xl text-sm leading-6 text-toned">
              Дайте модулю зрозумілу назву, коротко опишіть тему й додайте картки.
              Форма підтримує світлу та темну тему через стандартні токени Nuxt UI.
            </p>
          </div>

          <div class="grid gap-5 md:grid-cols-2">
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
              label="Тематика модуля"
              name="topic"
              description="Це допоможе зрозуміти, до якої сфери належить набір."
              required
              size="xl"
            >
              <USelectMenu
                v-model="state.topic"
                :items="topicOptions"
                value-key="value"
                label-key="label"
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
              placeholder="Опишіть, для кого цей модуль і що саме він покриває"
            />
          </UFormField>

          <div class="grid gap-5 md:grid-cols-[minmax(0,1fr)_minmax(16rem,20rem)]">
            <div
              class="relative overflow-hidden rounded-2xl border border-default p-5 text-white"
              :class="selectedTopic.previewClass"
            >
              <div class="absolute inset-0 bg-black/10" />
              <div class="relative">
                <p class="text-xs font-medium uppercase tracking-[0.24em] text-white/80">
                  Preview
                </p>
                <h3 class="mt-3 text-xl font-semibold">
                  {{ state.name.trim() || "Назва вашого модуля" }}
                </h3>
                <p class="mt-2 max-w-sm text-sm leading-6 text-white/85">
                  {{ state.description.trim() || selectedTopic.description }}
                </p>
                <div class="mt-6 inline-flex rounded-full border border-white/25 bg-white/15 px-3 py-1 text-xs">
                  {{ selectedTopic.label }}
                </div>
              </div>
            </div>

            <div class="rounded-2xl border border-default bg-elevated/60 p-5">
              <p class="text-sm font-medium text-highlighted">Коротке зведення</p>
              <div class="mt-4 space-y-3 text-sm text-toned">
                <div class="flex items-center justify-between gap-4">
                  <span>Кількість карток</span>
                  <span class="font-semibold text-highlighted">{{ state.cards.length }}</span>
                </div>
                <div class="flex items-center justify-between gap-4">
                  <span>Мінімум для форми</span>
                  <span class="font-semibold text-highlighted">2</span>
                </div>
                <div class="flex items-center justify-between gap-4">
                  <span>Опис</span>
                  <span class="font-semibold text-highlighted">
                    {{ state.description.trim() ? "Заповнений" : "Опціонально" }}
                  </span>
                </div>
                <div class="flex items-center justify-between gap-4">
                  <span>Тематика</span>
                  <span class="font-semibold text-highlighted">{{ selectedTopic.label }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="rounded-[1.75rem] border border-default bg-gradient-to-br from-primary/10 via-transparent to-success/10 p-6">
          <p class="text-sm font-medium uppercase tracking-[0.24em] text-primary">
            Порада
          </p>
          <h3 class="mt-3 text-xl font-semibold text-highlighted">
            Краще робити картки короткими
          </h3>
          <p class="mt-3 text-sm leading-6 text-toned">
            Один термін, одна думка, один візуальний акцент. Так модуль читається
            швидше і краще працює на повторення.
          </p>

          <div class="mt-5 rounded-2xl border border-default bg-default/80 p-4 text-sm text-toned">
            Для кольорів і зображень нижче використані базові компоненти з підтримкою
            помилок, світлої та темної теми.
          </div>
        </div>
      </div>
    </section>

    <section class="rounded-[2rem] border border-default bg-default/80 p-6 shadow-sm sm:p-8">
      <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p class="text-sm font-medium uppercase tracking-[0.24em] text-primary">
            Картки
          </p>
          <h2 class="mt-1 text-2xl font-semibold text-highlighted">
            Наповніть модуль контентом
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
          v-model="state.cards[index]"
          :index="index"
          :can-remove="state.cards.length > 2"
          :is-first="index === 0"
          :is-last="index === state.cards.length - 1"
          @remove="removeCard(index)"
          @move-up="moveCard(index, index - 1)"
          @move-down="moveCard(index, index + 1)"
        />
      </div>
    </section>

    <div class="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
      <UButton
        type="button"
        size="xl"
        variant="ghost"
        color="neutral"
        icon="i-lucide-plus"
        @click="addCard"
      >
        Ще одна картка
      </UButton>

      <UButton
        type="submit"
        size="xl"
        class="justify-center"
      >
        Створити модуль
      </UButton>
    </div>
  </UForm>
</template>

<script setup lang="ts">
import { z } from "zod";
import type { ICard } from "../components/CardForm.vue";

interface ISet {
  name: string;
  topic: TopicValue;
  description: string;
  cards: ICard[];
}

const topicOptions = [
  {
    label: "Музика",
    value: "music",
    icon: "i-lucide-music-4",
    description: "Терміни, стилі, інструменти, жанри та все, що пов’язано з музикою.",
    previewClass: "bg-gradient-to-br from-fuchsia-600 via-rose-500 to-orange-400",
  },
  {
    label: "Медицина",
    value: "medicine",
    icon: "i-lucide-stethoscope",
    description: "Анатомія, терміни, діагнози, препарати та інший медичний контент.",
    previewClass: "bg-gradient-to-br from-cyan-700 via-sky-600 to-emerald-500",
  },
  {
    label: "Книги",
    value: "books",
    icon: "i-lucide-book-open-text",
    description: "Автори, сюжети, персонажі, літературні терміни та читацькі добірки.",
    previewClass: "bg-gradient-to-br from-amber-700 via-orange-600 to-yellow-500",
  },
  {
    label: "Спорт",
    value: "sport",
    icon: "i-lucide-trophy",
    description: "Види спорту, правила, інвентар, команди, тактики та спортивні терміни.",
    previewClass: "bg-gradient-to-br from-lime-600 via-emerald-500 to-cyan-500",
  },
  {
    label: "Мови",
    value: "languages",
    icon: "i-lucide-languages",
    description: "Слова, переклади, фрази, граматика та мовні конструкції.",
    previewClass: "bg-gradient-to-br from-violet-700 via-purple-600 to-fuchsia-500",
  },
  {
    label: "Наука",
    value: "science",
    icon: "i-lucide-flask-conical",
    description: "Формули, поняття, процеси, явища та матеріали з природничих наук.",
    previewClass: "bg-gradient-to-br from-blue-700 via-indigo-600 to-cyan-500",
  },
  {
    label: "Історія",
    value: "history",
    icon: "i-lucide-landmark",
    description: "Дати, події, особистості, епохи та історичні поняття.",
    previewClass: "bg-gradient-to-br from-stone-700 via-amber-700 to-orange-500",
  },
  {
    label: "Інше",
    value: "other",
    icon: "i-lucide-shapes",
    description: "Універсальна тематика для наборів, які не входять в основні категорії.",
    previewClass: "bg-gradient-to-br from-slate-700 via-slate-600 to-zinc-500",
  },
] as const;

type TopicValue = (typeof topicOptions)[number]["value"];

const optionalString = z.preprocess(
  (value) => (typeof value === "string" ? value.trim() || undefined : undefined),
  z.string().trim().optional(),
);

const optionalHexColor = z.preprocess(
  (value) => (typeof value === "string" && !value.trim() ? undefined : value),
  z
    .string()
    .regex(/^#(?:[0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, "Вкажіть коректний HEX-колір")
    .optional(),
);

const cardSchema = z.object({
  position: z.number(),
  term: z.string().trim().min(1, "Вкажіть термін"),
  termImage: optionalString,
  definition: z.string().trim().min(1, "Вкажіть визначення"),
  definitionImage: optionalString,
  textColor: optionalHexColor,
  backgroundColor: optionalHexColor,
});

const setSchema = z.object({
  name: z.string().trim().min(2, "Назва має містити щонайменше 2 символи"),
  topic: z.enum(topicOptions.map((topic) => topic.value) as [TopicValue, ...TopicValue[]], {
    error: "Оберіть тематику модуля",
  }),
  description: z.preprocess(
    (value) => (typeof value === "string" && !value.trim() ? undefined : value),
    z.string().trim().max(280, "Опис має бути коротшим за 280 символів").optional(),
  ),
  cards: z.array(cardSchema).min(2, "Додайте щонайменше дві картки"),
});

const initialCard = (position: number): ICard => {
  return {
    position,
    term: "",
    termImage: undefined,
    definition: "",
    definitionImage: undefined,
    textColor: undefined,
    backgroundColor: undefined,
  };
};

const state = reactive<ISet>({
  name: "",
  topic: "music",
  description: "",
  cards: [initialCard(0), initialCard(1)],
});

const selectedTopic = computed(() => {
  return topicOptions.find((topic) => topic.value === state.topic) || topicOptions[0];
});

const syncCardPositions = () => {
  state.cards.forEach((card, index) => {
    card.position = index;
  });
};

const addCard = () => {
  state.cards.push(initialCard(state.cards.length));
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
  state.cards.splice(toIndex, 0, card);
  syncCardPositions();
};

const onSubmit = (event: { data: z.output<typeof setSchema> }) => {
  console.log("validated set", event.data);
};

const onError = async (event: { errors?: Array<{ id?: string }> }) => {
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

  if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
    element.focus();
  }
};
</script>

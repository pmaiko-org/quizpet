<template>
  <div class="space-y-8">
    <section
      class="
        overflow-hidden rounded-4xl border border-default bg-linear-to-br
        from-primary/12 via-default to-success/10 p-6 shadow-sm
        sm:p-8
      "
    >
      <div
        class="
          grid gap-8
          xl:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)] xl:items-start
        "
      >
        <div class="space-y-5">
          <div class="space-y-3">
            <p
              class="
                text-sm font-medium tracking-[0.24em] text-primary uppercase
              "
            >
              Бібліотека карток
            </p>
            <div class="space-y-3">
              <h1
                class="
                  text-3xl font-semibold text-highlighted
                  sm:text-4xl
                "
              >
                Зберігайте набори в одному охайному просторі
              </h1>
              <p
                class="
                  max-w-2xl text-sm/6 text-toned
                  sm:text-base
                "
              >
                Тут зібрані всі ваші модулі для навчання. Переглядайте тематики,
                швидко оцінюйте наповнення та додавайте нові набори без зайвого
                шуму.
              </p>
            </div>
          </div>

          <div
            class="
              flex flex-col gap-3
              sm:flex-row
            "
          >
            <UButton
              to="/cards/create"
              icon="i-lucide-plus"
              size="xl"
              class="justify-center"
            >
              Створити набір
            </UButton>

            <UButton
              v-if="pending"
              loading
              variant="ghost"
              color="neutral"
              size="xl"
            >
              Завантажуємо набори
            </UButton>
            <UButton
              v-else
              icon="i-lucide-refresh-cw"
              variant="outline"
              color="neutral"
              size="xl"
              class="justify-center"
              @click="refreshSets"
            >
              Оновити список
            </UButton>
          </div>
        </div>

        <div
          class="
            grid gap-4
            sm:grid-cols-3
            xl:grid-cols-1
          "
        >
          <div
            v-for="stat in stats"
            :key="stat.label"
            class="
              rounded-[1.5rem] border border-default bg-default/80 p-5
              backdrop-blur-sm
            "
          >
            <div class="flex items-start justify-between gap-4">
              <div>
                <p class="text-sm text-toned">
                  {{ stat.label }}
                </p>
                <p class="mt-2 text-3xl font-semibold text-highlighted">
                  {{ stat.value }}
                </p>
              </div>

              <div
                class="
                  flex size-10 items-center justify-center rounded-2xl
                  bg-primary/10 text-primary
                "
              >
                <UIcon
                  :name="stat.icon"
                  class="size-5"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="space-y-4">
      <div
        class="
          flex flex-col gap-2
          sm:flex-row sm:items-end sm:justify-between
        "
      >
        <div>
          <p
            class="text-sm font-medium tracking-[0.2em] text-primary uppercase"
          >
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

      <div
        v-if="pending"
        class="
          grid gap-4
          lg:grid-cols-2
        "
      >
        <div
          v-for="index in 4"
          :key="index"
          class="
            rounded-[1.75rem] border border-default bg-default/80 p-6 shadow-sm
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

      <div
        v-else-if="error"
        class="rounded-[1.75rem] border border-error/30 bg-error/5 p-6"
      >
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
              Не вдалося завантажити набори
            </h3>
            <p class="max-w-2xl text-sm/6 text-toned">
              Спробуйте ще раз. Якщо проблема повторюється, варто перевірити
              доступність бекенду.
            </p>
          </div>

          <UButton
            icon="i-lucide-refresh-cw"
            color="error"
            variant="soft"
            size="lg"
            @click="refreshSets"
          >
            Спробувати знову
          </UButton>
        </div>
      </div>

      <div
        v-else-if="!sets.length"
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
          Почніть з першого набору: додайте тему, короткий опис і кілька карток,
          щоб бібліотека одразу виглядала живою.
        </p>
        <UButton
          to="/cards/create"
          icon="i-lucide-plus"
          size="xl"
          class="mt-6 justify-center"
        >
          Створити перший набір
        </UButton>
      </div>

      <div
        v-else
        class="
          grid gap-4
          lg:grid-cols-2
        "
      >
        <article
          v-for="set in sets"
          :key="set.id"
          class="
            group rounded-[1.75rem] border border-default bg-default/80 p-6
            shadow-sm transition-all duration-200
            hover:-translate-y-0.5 hover:shadow-md
          "
        >
          <div class="flex items-start justify-between gap-4">
            <div class="space-y-3">
              <p
                class="
                  text-sm font-medium tracking-[0.2em] text-primary uppercase
                "
              >
                Набір карток
              </p>
              <h3 class="text-2xl font-semibold text-highlighted">
                {{ set.name }}
              </h3>
            </div>

            <div
              class="
                flex size-11 items-center justify-center rounded-2xl
                bg-primary/10 text-primary transition-colors
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
                :to="`/cards/${set.id}/learn`"
                icon="i-lucide-graduation-cap"
                size="lg"
              >
                Вчитись
              </UButton>

              <UButton
                to="/cards/create"
                variant="outline"
                color="neutral"
                icon="i-lucide-plus"
                size="lg"
              >
                Новий набір
              </UButton>

              <UButton
                v-if="canDeleteSet(set)"
                :to="`/cards/${set.id}/edit`"
                variant="outline"
                color="primary"
                icon="i-lucide-pencil"
                size="lg"
              >
                Редагувати
              </UButton>
            </div>

            <UButton
              v-if="canDeleteSet(set)"
              :loading="deletingSetId === set.id"
              color="error"
              variant="ghost"
              icon="i-lucide-trash-2"
              size="lg"
              @click="handleDeleteSet(set)"
            >
              Видалити
            </UButton>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { ISetListItemResponse } from "~/types/api.generated";

definePageMeta({
  layout: "cabinet",
});

const { $repository } = useNuxtApp();
const { profile } = useProfileStore();

const { data, pending, error, refresh } = await useAsyncData(
  "sets",
  () => $repository.sets.getSets(),
  {
    default: () => [],
    server: false,
  },
);

const refreshSets = () => refresh();

const deletingSetId = ref<string | null>(null);
const sets = computed<ISetListItemResponse[]>(() => data.value ?? []);

const stats = computed(() => {
  const topicsCount = new Set(
    sets.value.flatMap(set => set.topics.map(topic => topic.id)),
  ).size;

  const describedSets = sets.value.filter(set =>
    set.description?.trim(),
  ).length;

  return [
    {
      label: "Усього наборів",
      value: sets.value.length,
      icon: "i-lucide-library",
    },
    {
      label: "Унікальних тематик",
      value: topicsCount,
      icon: "i-lucide-tags",
    },
    {
      label: "З описом",
      value: describedSets,
      icon: "i-lucide-file-text",
    },
  ];
});

const summaryText = computed(() => {
  const total = sets.value.length;

  if (!total) {
    return "Почніть з першого набору та зберіть власну навчальну полицю.";
  }

  if (total === 1) {
    return "1 набір уже готовий для повторення та подальшого наповнення.";
  }

  return `${total} набори зібрано в одній бібліотеці для швидкого доступу.`;
});

const getAuthorName = (set: ISetListItemResponse) => {
  const fullName = `${set.user.firstName} ${set.user.lastName}`.trim();

  return fullName || set.user.email;
};

const canDeleteSet = (set: ISetListItemResponse) => {
  return Boolean(
    profile.value?.email && profile.value.email === set.user.email,
  );
};

const handleDeleteSet = async (set: ISetListItemResponse) => {
  if (deletingSetId.value) {
    return;
  }

  const shouldDelete = window.confirm(
    `Видалити набір "${set.name}"? Цю дію не можна скасувати.`,
  );

  if (!shouldDelete) {
    return;
  }

  deletingSetId.value = set.id;

  try {
    await $repository.sets.deleteSet(set.id);
    await refresh();
  } finally {
    deletingSetId.value = null;
  }
};
</script>

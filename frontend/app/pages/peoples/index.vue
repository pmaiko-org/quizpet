<template>
  <div class="space-y-8">
    <section
      class="
        overflow-hidden rounded-4xl border border-default bg-linear-to-br
        from-primary/12 via-default to-success/10 p-6 shadow-sm
        sm:p-8
      "
    >
      <div class="space-y-3">
        <p class="text-sm font-medium tracking-[0.24em] text-primary uppercase">
          Спільнота
        </p>
        <h1
          class="
            text-3xl font-semibold text-highlighted
            sm:text-4xl
          "
        >
          Учасники платформи
        </h1>
        <p
          class="
            max-w-2xl text-sm/6 text-toned
            sm:text-base
          "
        >
          Тут зібрані всі зареєстровані користувачі. Переглядайте профілі та
          знаходьте однодумців.
        </p>
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
            Користувачі
          </p>
          <h2 class="mt-1 text-2xl font-semibold text-highlighted">
            Усі учасники
          </h2>
        </div>

        <p
          v-if="meta"
          class="text-sm text-toned"
        >
          {{ meta.total }} {{ pluralUsers(meta.total) }}
        </p>
      </div>

      <div
        v-if="pending"
        class="
          grid gap-4
          sm:grid-cols-2
          lg:grid-cols-3
        "
      >
        <div
          v-for="i in perPage"
          :key="i"
          class="
            rounded-[1.75rem] border border-default bg-default/80 p-6 shadow-sm
          "
        >
          <div class="animate-pulse space-y-3">
            <div class="flex items-center gap-4">
              <div class="size-12 rounded-full bg-default" />
              <div class="flex-1 space-y-2">
                <div class="h-4 w-2/3 rounded-full bg-default" />
                <div class="h-3 w-1/2 rounded-full bg-default" />
              </div>
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
              Не вдалося завантажити користувачів
            </h3>
          </div>

          <UButton
            icon="i-lucide-refresh-cw"
            color="error"
            variant="soft"
            size="lg"
            @click="refresh()"
          >
            Спробувати знову
          </UButton>
        </div>
      </div>

      <div
        v-else-if="!users.length"
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
            name="i-lucide-users"
            class="size-7"
          />
        </div>
        <h3 class="mt-5 text-2xl font-semibold text-highlighted">
          Користувачів поки немає
        </h3>
      </div>

      <div
        v-else
        class="
          grid gap-4
          sm:grid-cols-2
          lg:grid-cols-3
        "
      >
        <article
          v-for="user in users"
          :key="user.id"
          class="
            rounded-[1.75rem] border border-default bg-default/80 p-6 shadow-sm
            transition-all duration-200
            hover:-translate-y-0.5 hover:shadow-md
          "
        >
          <div class="flex items-center gap-4">
            <UAvatar
              :src="user.avatar"
              :alt="`${user.firstName} ${user.lastName}`"
              size="lg"
            />
            <div class="min-w-0">
              <p class="truncate font-semibold text-highlighted">
                {{ user.firstName }} {{ user.lastName }}
              </p>
              <p class="truncate text-sm text-toned">
                {{ user.email }}
              </p>
            </div>
          </div>
        </article>
      </div>

      <div
        v-if="meta && meta.pages > 1"
        class="flex justify-center pt-2"
      >
        <UPagination
          :modelValue="page"
          :total="meta.total"
          :pageCount="perPage"
          @update:model-value="handlePageChange"
        />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { IUserResponse, IPaginationMeta } from "~/types/api.generated";

definePageMeta({
  layout: "cabinet",
});

const { $repository } = useNuxtApp();

const perPage = 20;
const page = ref(1);

const { data, pending, error, refresh } = await useAsyncData(
  "peoples",
  () => $repository.users.getUsers({ page: page.value, perPage }),
  { server: false, watch: [page] },
);

const users = computed<IUserResponse[]>(() => data.value?.data ?? []);
const meta = computed<IPaginationMeta | null>(() => data.value?.meta ?? null);

const handlePageChange = (newPage: number) => {
  page.value = newPage;
};

const pluralUsers = (count: number) => {
  if (count % 10 === 1 && count % 100 !== 11) return "користувач";
  if (
    count % 10 >= 2
    && count % 10 <= 4
    && (count % 100 < 10 || count % 100 >= 20)
  ) {
    return "користувачі";
  }
  return "користувачів";
};
</script>

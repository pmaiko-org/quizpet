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

    <BaseDataBoundary
      :pending="pending"
      :error="error"
      :empty="!users.length"
      errorTitle="Не вдалося завантажити користувачів"
      @retry="emit('refresh')"
    >
      <template #loading>
        <div
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
              rounded-[1.75rem] border border-default bg-default/80 p-6
              shadow-sm
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
              name="i-lucide-users"
              class="size-7"
            />
          </div>
          <h3 class="mt-5 text-2xl font-semibold text-highlighted">
            Користувачів поки немає
          </h3>
        </div>
      </template>

      <div
        class="
          grid gap-4
          sm:grid-cols-2
          lg:grid-cols-3
        "
      >
        <PersonCard
          v-for="user in users"
          :key="user.id"
          :user="user"
        />
      </div>
    </BaseDataBoundary>

    <div
      v-if="meta && meta.pages > 1"
      class="flex justify-center pt-2"
    >
      <UPagination
        v-model="page"
        :total="meta.total"
        :pageCount="perPage"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import type { IPaginationMeta, IUserResponse } from "~/types/api.generated";

import { pluralUsers } from "../utils";

const {
  users,
  meta = null,
  perPage,
  pending = false,
  error = null,
} = defineProps<{
  users: IUserResponse[];
  meta?: IPaginationMeta | null;
  perPage: number;
  pending?: boolean;
  error?: unknown;
}>();

const page = defineModel<number>("page", { required: true });

const emit = defineEmits<{
  refresh: [];
}>();
</script>

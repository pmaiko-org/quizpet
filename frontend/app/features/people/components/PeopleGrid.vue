<template>
  <section class="space-y-3">
    <BaseSectionHeader
      eyebrow="Користувачі"
      title="Усі учасники"
      :summary="meta ? `${meta.total} ${pluralUsers(meta.total)}` : ''"
    />

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
            grid gap-3
            sm:grid-cols-2
            xl:grid-cols-3
          "
        >
          <div
            v-for="i in perPage"
            :key="i"
            class="app-surface app-radius-surface p-4"
          >
            <div class="flex items-center gap-3">
              <USkeleton class="size-12 shrink-0 rounded-full" />
              <div class="min-w-0 flex-1 space-y-2">
                <USkeleton class="h-4 w-2/3" />
                <USkeleton class="h-3 w-4/5" />
              </div>
            </div>
          </div>
        </div>
      </template>

      <template #empty>
        <div
          class="
            app-radius-surface border border-dashed border-default
            bg-elevated/55 p-6 text-center
          "
        >
          <div
            class="
              app-radius-surface mx-auto flex size-11 items-center
              justify-center bg-primary/10 text-primary
            "
          >
            <UIcon
              name="i-lucide-users"
              class="size-5"
            />
          </div>
          <h3 class="mt-4 text-xl font-semibold text-highlighted">
            Користувачів поки немає
          </h3>
        </div>
      </template>

      <div
        class="
          grid gap-3
          sm:grid-cols-2
          xl:grid-cols-3
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

<template>
  <section class="space-y-3">
    <BaseSectionHeader
      :eyebrow="$wt('eyebrow')"
      :title="$wt('title')"
      :summary="meta ? t('count', { count: meta.total }, meta.total) : ''"
    />

    <BaseDataBoundary
      :pending="pending"
      :error="error"
      :empty="!users.length"
      :errorTitle="$wt('error')"
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
            v-for="i in meta?.perPage ?? 6"
            :key="i"
            class="
              rounded-md border border-default bg-elevated/96 p-4 shadow-sm
            "
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
              name="i-lucide-users"
              class="size-5"
            />
          </div>
          <h3 class="mt-4 text-xl font-semibold text-highlighted">
            {{ $wt("empty") }}
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

    <BasePagination
      v-if="meta"
      v-model:page="page"
      :meta="meta"
      :disabled="pending"
    />
  </section>
</template>

<script setup lang="ts">
import type {
  IPaginationMeta,
  IUserResponse,
} from "~/shared/types/api.generated";

const {
  users,
  meta = null,
  pending = false,
  error = null,
} = defineProps<{
  users: IUserResponse[];
  meta?: IPaginationMeta | null;
  pending?: boolean;
  error?: unknown;
}>();

const { t } = useCmsWidgetI18n();

const page = defineModel<number>("page", { required: true });

const emit = defineEmits<{
  refresh: [];
}>();
const $wt = t;
</script>

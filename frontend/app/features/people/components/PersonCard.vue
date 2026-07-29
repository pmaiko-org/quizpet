<template>
  <article
    class="
      app-surface app-radius-surface p-4 transition-all duration-200
      hover:-translate-y-0.5 hover:border-primary/25
      hover:shadow-(--app-shadow-md)
    "
  >
    <div class="flex items-center gap-3">
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
</template>

<script setup lang="ts">
import type { IUserResponse } from "~/types/api.generated";

const { user } = defineProps<{
  user: IUserResponse;
}>();
</script>

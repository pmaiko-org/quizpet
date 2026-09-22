<template>
  <div
    v-if="meta.pages > 1"
    class="flex justify-center pt-2"
  >
    <UPagination
      v-model:page="page"
      :total="meta.total"
      :itemsPerPage="meta.perPage"
      :disabled="disabled"
    />
  </div>
</template>

<script setup lang="ts">
import type { IPaginationMeta } from "~/shared/types/api.generated";

const { meta, disabled = false } = defineProps<{
  meta: IPaginationMeta;
  disabled?: boolean;
}>();

const page = defineModel<number>("page", { required: true });
</script>

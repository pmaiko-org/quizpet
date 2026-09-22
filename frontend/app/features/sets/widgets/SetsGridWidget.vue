<template>
  <SetsGrid
    v-model:page="page"
    :sets="sets"
    :meta="meta"
    :summaryText="summaryText"
    :pending="pending"
    :error="error"
    :deletingId="deletingSetId"
    :canDelete="canDelete"
    @refresh="handleRefresh"
    @delete="handleDeleteSet"
  />
</template>

<script setup lang="ts">
const { email } = useCurrentUser();

const {
  sets,
  meta,
  page,
  summaryText,
  pending,
  error,
  deletingSetId,
  canDelete,
  deleteSet: handleDeleteSet,
  refresh: handleRefresh,
} = useSetsList(email);
</script>

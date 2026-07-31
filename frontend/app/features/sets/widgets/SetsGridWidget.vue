<template>
  <SetsGrid
    :sets="sets"
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
  summaryText,
  pending,
  error,
  deletingSetId,
  canDelete,
  deleteSet: handleDeleteSet,
  refresh: handleRefresh,
} = useSetsList(email);
</script>

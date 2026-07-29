<template>
  <SetsGrid
    :sets="sets"
    :summaryText="summaryText"
    :pending="pending"
    :error="error"
    :deletingId="deletingSetId"
    :canDelete="canDelete"
    @refresh="refresh"
    @delete="deleteSet"
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
  deleteSet,
  refresh,
} = useSetsList(email);
</script>

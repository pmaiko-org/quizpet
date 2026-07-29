<template>
  <BaseDataBoundary
    :pending="status === 'pending' || status === 'idle'"
    :error="error"
    errorTitle="Не вдалося завантажити набір"
    errorDescription="Спробуйте повторно відкрити редактор набору."
    @retry="refresh"
  >
    <template #loading>
      <SetFormSkeleton />
    </template>

    <SetForm
      v-if="set"
      :key="set.id"
      :set="set"
    />
  </BaseDataBoundary>
</template>

<script setup lang="ts">
const { set, status, error, refresh } = useSetEdit();
</script>

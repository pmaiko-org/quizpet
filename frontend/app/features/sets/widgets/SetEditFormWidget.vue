<template>
  <BaseDataBoundary
    :pending="status === 'pending' || status === 'idle'"
    :error="error"
    :errorTitle="$t('sets.edit.loadError.title')"
    :errorDescription="$t('sets.edit.loadError.description')"
    @retry="handleRetry"
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
const { set, status, error, refresh: handleRetry } = useSetEdit();
</script>

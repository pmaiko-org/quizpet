<template>
  <BaseDataBoundary
    :pending="pending"
    :error="error"
    :errorTitle="$wt('edit.loadError.title')"
    :errorDescription="$wt('edit.loadError.description')"
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
const { set, pending, error, refresh: handleRetry } = useSetEdit();
const { t: $wt } = useCmsWidgetI18n();
</script>

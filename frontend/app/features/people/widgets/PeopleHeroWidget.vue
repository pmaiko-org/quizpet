<template>
  <BaseHeroSection
    :eyebrow="$wt('eyebrow')"
    :title="$wt('title')"
    :description="$wt('description')"
  />
</template>

<script setup lang="ts">
const { t: $wt } = useCmsWidgetI18n();
</script>

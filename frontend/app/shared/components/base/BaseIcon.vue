<template>
  <UIcon v-bind="$props" />
</template>

<script setup lang="ts">
import type { IconProps } from "#ui/components/Icon.vue";

defineProps<IconProps>();
</script>

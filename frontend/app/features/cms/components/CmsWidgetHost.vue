<template>
  <component
    :is="component"
    v-bind="componentProps"
  />
</template>

<script setup lang="ts">
import type { Component } from "vue";

const { component, componentProps, translations } = defineProps<{
  component: Component;
  componentProps: Record<string, unknown>;
  translations: Array<{ key: string; value: string }>;
}>();

const { locale } = useI18n({ useScope: "global" });
const messages = Object.fromEntries(
  translations.map(({ key, value }) => [key, value]),
);

useI18n({
  useScope: "local",
  inheritLocale: true,
  messages: { [locale.value]: messages },
});
</script>

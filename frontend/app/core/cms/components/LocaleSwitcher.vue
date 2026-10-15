<template>
  <UDropdownMenu
    :items="items"
    :content="{ align: 'end' }"
  >
    <UButton
      color="neutral"
      variant="ghost"
      icon="i-lucide-languages"
      :class="buttonClass"
      :aria-label="currentLocale?.name"
    >
      <span :class="labelClass">{{ currentLocale?.code.toUpperCase() }}</span>
    </UButton>
  </UDropdownMenu>
</template>

<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";

const { buttonClass, labelClass } = defineProps<{
  buttonClass?: string;
  labelClass?: string;
}>();

const { options, switchLocale } = useLocaleSwitch();

const currentLocale = computed(() =>
  options.value.find(option => option.isCurrent),
);
const items = computed<DropdownMenuItem[]>(() =>
  options.value.map(option => ({
    label: option.name,
    type: "checkbox",
    checked: option.isCurrent,
    onSelect: () => {
      switchLocale(option.code);
    },
  })),
);
</script>

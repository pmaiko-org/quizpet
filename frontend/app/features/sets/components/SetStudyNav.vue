<template>
  <nav
    class="flex flex-wrap items-center gap-2"
    aria-label="Study modes"
  >
    <UButton
      :to="{ name: RouteName.SETS }"
      color="neutral"
      variant="ghost"
      icon="i-lucide-arrow-left"
      aria-label="Back to sets"
    />
    <UButton
      v-for="mode in modes"
      :key="mode.name"
      :to="{ name: mode.name, params: { id: setId } }"
      :variant="active === mode.name ? 'soft' : 'ghost'"
      :color="active === mode.name ? 'primary' : 'neutral'"
      :aria-current="active === mode.name ? 'page' : undefined"
      :icon="mode.icon"
    >
      {{ mode.label }}
    </UButton>
  </nav>
</template>

<script setup lang="ts">
import { RouteName } from "~/shared/constants";

const { setId, active } = defineProps<{
  setId: string;
  active: typeof RouteName.SETS_ID_LEARN | typeof RouteName.SETS_ID_MATCH;
}>();

const modes = [
  { name: RouteName.SETS_ID_LEARN, label: "Learn", icon: "i-lucide-layers-3" },
  {
    name: RouteName.SETS_ID_MATCH,
    label: "Match",
    icon: "i-lucide-copy-check",
  },
];
</script>

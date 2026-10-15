<template>
  <nav
    class="flex flex-wrap items-center gap-2"
    :aria-label="$t('study.modes')"
  >
    <UButton
      :to="routes.resolve('sets')"
      color="neutral"
      variant="ghost"
      icon="i-lucide-arrow-left"
      :aria-label="$t('study.backToSets')"
    />
    <UButton
      v-for="mode in modes"
      :key="mode.name"
      :to="routes.resolve(mode.name, { id: setId })"
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
const { setId, active } = defineProps<{
  setId: string;
  active: "sets-id-learn" | "sets-id-match";
}>();

const { t } = useI18n();
const modes = computed(
  () =>
    [
      {
        name: "sets-id-learn",
        label: t("study.learn"),
        icon: "i-lucide-layers-3",
      },
      {
        name: "sets-id-match",
        label: t("study.match"),
        icon: "i-lucide-copy-check",
      },
    ] as const,
);

const routes = usePageRoutes();
</script>

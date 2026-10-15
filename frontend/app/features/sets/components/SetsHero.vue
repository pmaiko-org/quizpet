<template>
  <BaseHeroSection
    :eyebrow="$t('sets.hero.eyebrow')"
    :title="$t('sets.hero.title')"
    :description="$t('sets.hero.description')"
  >
    <div
      class="
        flex flex-col gap-2
        sm:flex-row
      "
    >
      <UButton
        :to="routes.resolve('sets-create')"
        icon="i-lucide-plus"
        size="lg"
        class="justify-center"
      >
        {{ $t("sets.create") }}
      </UButton>
    </div>

    <template #aside>
      <BaseMetricGrid
        :items="stats"
        class="lg:grid-cols-1"
        variant="hero"
        columns="three"
        :pending="pending"
      />
    </template>
  </BaseHeroSection>
</template>

<script setup lang="ts">
interface IHeroStat {
  label: string;
  value: number;
  icon: string;
}

const routes = usePageRoutes();

const { stats, pending = false } = defineProps<{
  stats: IHeroStat[];
  pending?: boolean;
}>();
</script>

<template>
  <BaseHeroSection
    eyebrow="Бібліотека карток"
    title="Набори для швидкого повторення"
    description="Перемикайтеся між власними наборами та всією доступною бібліотекою, відкривайте навчання або створюйте нову тему."
  >
    <div
      class="
        flex flex-col gap-2
        sm:flex-row
      "
    >
      <UButton
        :to="{ name: RouteName.SETS_CREATE }"
        icon="i-lucide-plus"
        size="lg"
        class="justify-center"
      >
        Створити набір
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
import { RouteName } from "~/shared/constants";

interface IHeroStat {
  label: string;
  value: number;
  icon: string;
}

const { stats, pending = false } = defineProps<{
  stats: IHeroStat[];
  pending?: boolean;
}>();
</script>

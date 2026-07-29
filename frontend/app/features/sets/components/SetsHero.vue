<template>
  <AppHeroSection
    eyebrow="Бібліотека карток"
    title="Ваші набори для швидкого повторення"
    description="Переглядайте наповнення, відкривайте навчання або створюйте нову тему."
  >
    <div
      class="
        flex flex-col gap-2
        sm:flex-row
      "
    >
      <UButton
        to="/sets/create"
        icon="i-lucide-plus"
        size="lg"
        class="justify-center"
      >
        Створити набір
      </UButton>

      <ClientOnly>
        <UButton
          :loading="pending"
          icon="i-lucide-refresh-cw"
          variant="outline"
          color="neutral"
          size="lg"
          class="justify-center"
          @click="emit('refresh')"
        >
          Оновити список
        </UButton>

        <template #fallback>
          <UButton
            icon="i-lucide-refresh-cw"
            variant="outline"
            color="neutral"
            size="lg"
            class="justify-center"
            disabled
          >
            Оновити список
          </UButton>
        </template>
      </ClientOnly>
    </div>

    <template #aside>
      <AppMetricGrid
        :items="stats"
        class="lg:grid-cols-1"
        variant="hero"
        columns="three"
        :pending="pending"
      />
    </template>
  </AppHeroSection>
</template>

<script setup lang="ts">
interface IHeroStat {
  label: string;
  value: number;
  icon: string;
}

const { stats, pending = false } = defineProps<{
  stats: IHeroStat[];
  pending?: boolean;
}>();

const emit = defineEmits<{
  refresh: [];
}>();
</script>

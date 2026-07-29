<template>
  <section
    class="
      overflow-hidden rounded-4xl border border-default bg-linear-to-br
      from-primary/12 via-default to-success/10 p-6 shadow-sm
      sm:p-8
    "
  >
    <div
      class="
        grid gap-8
        xl:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)] xl:items-start
      "
    >
      <div class="space-y-5">
        <div class="space-y-3">
          <p
            class="text-sm font-medium tracking-[0.24em] text-primary uppercase"
          >
            Бібліотека карток
          </p>
          <div class="space-y-3">
            <h1
              class="
                text-3xl font-semibold text-highlighted
                sm:text-4xl
              "
            >
              Зберігайте набори в одному охайному просторі
            </h1>
            <p
              class="
                max-w-2xl text-sm/6 text-toned
                sm:text-base
              "
            >
              Тут зібрані всі ваші модулі для навчання. Переглядайте тематики,
              швидко оцінюйте наповнення та додавайте нові набори без зайвого
              шуму.
            </p>
          </div>
        </div>

        <div
          class="
            flex flex-col gap-3
            sm:flex-row
          "
        >
          <UButton
            to="/sets/create"
            icon="i-lucide-plus"
            size="xl"
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
              size="xl"
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
                size="xl"
                class="justify-center"
                disabled
              >
                Оновити список
              </UButton>
            </template>
          </ClientOnly>
        </div>
      </div>

      <div
        class="
          grid gap-4
          sm:grid-cols-3
          xl:grid-cols-1
        "
      >
        <div
          v-for="stat in stats"
          :key="stat.label"
          class="
            rounded-[1.5rem] border border-default bg-default/80 p-5
            backdrop-blur-sm
          "
        >
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="text-sm text-toned">
                {{ stat.label }}
              </p>
              <p class="mt-2 text-3xl font-semibold text-highlighted">
                {{ stat.value }}
              </p>
            </div>

            <div
              class="
                flex size-10 items-center justify-center rounded-2xl
                bg-primary/10 text-primary
              "
            >
              <UIcon
                :name="stat.icon"
                class="size-5"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
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

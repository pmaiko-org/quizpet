<template>
  <div class="space-y-6">
    <section
      class="rounded-[2rem] border border-default bg-gradient-to-br from-primary/10 via-default to-warning/10 p-6 shadow-sm sm:p-8"
    >
      <p class="text-sm font-medium uppercase tracking-[0.24em] text-primary">
        Редагування набору
      </p>
      <h1 class="mt-3 text-3xl font-semibold text-highlighted sm:text-4xl">
        Редагування набору {{ route.params.id }}
      </h1>
      <p class="mt-4 max-w-2xl text-sm leading-6 text-toned sm:text-base">
        Це заготовка сторінки редагування. Сюди вже веде кнопка "Редагувати" зі
        списку наборів, а далі ми зможемо підключити поточну форму, підвантажити
        дані набору й зберігати зміни.
      </p>

      <div class="mt-6 flex flex-col gap-3 sm:flex-row">
        <UButton
          to="/cards"
          icon="i-lucide-arrow-left"
          variant="outline"
          color="neutral"
          size="xl"
        >
          Назад до наборів
        </UButton>

        <UButton
          :to="`/cards/${route.params.id}/learn`"
          icon="i-lucide-graduation-cap"
          size="xl"
        >
          Перейти до навчання
        </UButton>
      </div>
    </section>

    <SetForm
      v-if="set"
      :set="set"
    />

    <section
      v-else-if="status === 'pending'"
      class="rounded-[2rem] border border-default bg-default/80 p-6 text-sm text-toned shadow-sm sm:p-8"
    >
      Завантажуємо набір для редагування...
    </section>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();

definePageMeta({
  layout: "cabinet",
});

const { $repository } = useNuxtApp();

const { data: set, status } = useAsyncData(
  () => $repository.sets.getSet(route.params.id as string),
  {
    server: false,
  }
);
</script>

<template>
  <section
    class="
      rounded-4xl border border-default bg-linear-to-br from-primary/10
      via-default to-warning/10 p-6 shadow-sm
      sm:p-8
    "
  >
    <p class="text-sm font-medium tracking-[0.24em] text-primary uppercase">
      Редагування набору
    </p>
    <h1
      class="
        mt-3 text-3xl font-semibold text-highlighted
        sm:text-4xl
      "
    >
      Редагування набору {{ setId }}
    </h1>
    <p
      class="
        mt-4 max-w-2xl text-sm/6 text-toned
        sm:text-base
      "
    >
      Це заготовка сторінки редагування. Сюди вже веде кнопка "Редагувати" зі
      списку наборів, а далі ми зможемо підключити поточну форму, підвантажити
      дані набору й зберігати зміни.
    </p>

    <div
      class="
        mt-6 flex flex-col gap-3
        sm:flex-row
      "
    >
      <UButton
        :to="{ name: RouteName.SETS }"
        icon="i-lucide-arrow-left"
        variant="outline"
        color="neutral"
        size="xl"
      >
        Назад до наборів
      </UButton>

      <UButton
        :to="{ name: RouteName.SETS_ID_LEARN, params: { id: setId } }"
        icon="i-lucide-graduation-cap"
        size="xl"
      >
        Перейти до навчання
      </UButton>
    </div>
  </section>
</template>

<script setup lang="ts">
import { RouteName } from "~/constants";

const { setId } = defineProps<{
  setId: string;
}>();
</script>

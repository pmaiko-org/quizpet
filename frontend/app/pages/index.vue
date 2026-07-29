<template>
  <div class="space-y-6">
    <AppHeroSection
      eyebrow="Сьогодні у QuizPet"
      :title="heroTitle"
      description="Оберіть набір і проведіть кілька хвилин у фокусі. Прогрес складається з коротких, регулярних повторень."
      :pending="userPending"
    >
      <div
        class="
          flex flex-col gap-2
          sm:flex-row
        "
      >
        <UButton
          to="/sets"
          icon="i-lucide-play"
          size="lg"
          class="justify-center"
        >
          Почати навчання
        </UButton>
        <UButton
          to="/sets/create"
          icon="i-lucide-plus"
          size="lg"
          variant="outline"
          color="neutral"
          class="justify-center"
        >
          Новий набір
        </UButton>
      </div>

      <template #aside>
        <AppMetricGrid
          :items="overviewMetrics"
          class="lg:grid-cols-1"
          variant="hero"
          columns="three"
          :pending="statsPending"
        />
      </template>
    </AppHeroSection>

    <section class="space-y-3">
      <AppSectionHeader
        eyebrow="Швидкий доступ"
        title="Продовжуйте у своєму темпі"
        summary="Усе необхідне для навчання зібране поруч."
      />

      <div
        class="
          grid gap-3
          md:grid-cols-3
        "
      >
        <NuxtLink
          v-for="link in quickLinks"
          :key="link.to"
          :to="link.to"
          class="
            app-surface group app-radius-surface p-4 transition-all duration-200
            hover:-translate-y-0.5 hover:border-primary/30
            hover:shadow-(--app-shadow-md)
          "
        >
          <div class="flex items-start justify-between gap-4">
            <span
              class="
                app-radius-surface flex size-10 items-center justify-center
                bg-primary/10 text-primary transition-colors
                group-hover:bg-primary group-hover:text-inverted
              "
            >
              <UIcon
                :name="link.icon"
                class="size-5"
              />
            </span>
            <UIcon
              name="i-lucide-arrow-up-right"
              class="
                size-4 text-muted transition-transform
                group-hover:translate-x-0.5 group-hover:-translate-y-0.5
                group-hover:text-primary
              "
            />
          </div>
          <h2 class="mt-4 text-lg font-semibold text-highlighted">
            {{ link.title }}
          </h2>
          <p class="mt-1 text-sm/5 text-toned">
            {{ link.description }}
          </p>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "cabinet",
});

type TQuickLink = {
  title: string;
  description: string;
  icon: string;
  to: string;
};

useHead({
  title: "Головна | QuizPet",
});

const { stats, pending: statsPending } = useMyStats();
const { user, pending: userPending } = useCurrentUser();

const heroTitle = computed(() => {
  const firstName = user.value?.firstName?.trim();

  return firstName
    ? `${firstName}, готові до короткого навчального спринту?`
    : "Готові до короткого навчального спринту?";
});

const overviewMetrics = computed(() => [
  {
    label: "Люди",
    value: stats.value.peopleCount,
    icon: "i-lucide-users",
  },
  {
    label: "Набори",
    value: stats.value.mySetsCount,
    icon: "i-lucide-layers-3",
  },
  {
    label: "Теми",
    value: stats.value.myTopicsCount,
    icon: "i-lucide-book-open-text",
  },
]);

const quickLinks: TQuickLink[] = [
  {
    title: "Картки",
    description: "Ваші набори, повторення та швидкий старт навчання.",
    icon: "i-lucide-layers-3",
    to: "/sets",
  },
  {
    title: "Профіль",
    description: "Ім’я, аватар та особисті дані облікового запису.",
    icon: "i-lucide-user-round-pen",
    to: "/profile",
  },
  {
    title: "Спільнота",
    description: "Учасники платформи та майбутні навчальні зв’язки.",
    icon: "i-lucide-users",
    to: "/peoples",
  },
];
</script>

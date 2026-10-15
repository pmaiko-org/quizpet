<template>
  <div class="space-y-6">
    <BaseHeroSection
      :eyebrow="$t('home.eyebrow')"
      :title="heroTitle"
      :description="$t('home.summary')"
      :pending="userPending"
    >
      <div
        class="
          flex flex-col gap-2
          sm:flex-row
        "
      >
        <UButton
          :to="routes.resolve('sets')"
          icon="i-lucide-play"
          size="lg"
          class="justify-center"
        >
          {{ $t("home.startLearning") }}
        </UButton>
        <UButton
          :to="routes.resolve('sets-create')"
          icon="i-lucide-plus"
          size="lg"
          variant="outline"
          color="neutral"
          class="justify-center"
        >
          {{ $t("common.newSet") }}
        </UButton>
      </div>

      <template #aside>
        <BaseMetricGrid
          :items="overviewMetrics"
          class="lg:grid-cols-1"
          variant="hero"
          columns="three"
          :pending="statsPending"
        />
      </template>
    </BaseHeroSection>

    <section class="space-y-3">
      <BaseSectionHeader
        :eyebrow="$t('home.quickAccess')"
        :title="$t('home.keepPace')"
        :summary="$t('home.everythingNearby')"
      />

      <div
        class="
          grid gap-3
          md:grid-cols-3
        "
      >
        <NuxtLink
          v-for="link in quickLinks"
          :key="link.title"
          :to="link.to"
          class="
            group rounded-md border border-default bg-elevated/96 p-4 shadow-sm
            transition-all duration-200
            hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md
          "
        >
          <div class="flex items-start justify-between gap-4">
            <span
              class="
                flex size-10 items-center justify-center rounded-md
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
const { t } = useI18n();
const routes = usePageRoutes();
const { stats, pending: statsPending } = useMyStats();
const { user, pending: userPending } = useCurrentUser();

const heroTitle = computed(() => {
  const firstName = user.value?.firstName?.trim();
  return firstName
    ? t("home.title.named", { name: firstName })
    : t("home.title.default");
});

const overviewMetrics = computed(() => [
  {
    label: t("home.metric.people"),
    value: stats.value.peopleCount,
    icon: "i-lucide-users",
  },
  {
    label: t("home.metric.sets"),
    value: stats.value.mySetsCount,
    icon: "i-lucide-layers-3",
  },
  {
    label: t("home.metric.topics"),
    value: stats.value.myTopicsCount,
    icon: "i-lucide-book-open-text",
  },
]);

const quickLinks = computed(() => [
  {
    title: t("home.link.cards.title"),
    description: t("home.link.cards.description"),
    icon: "i-lucide-layers-3",
    to: routes.resolve("sets"),
  },
  {
    title: t("home.link.profile.title"),
    description: t("home.link.profile.description"),
    icon: "i-lucide-user-round-pen",
    to: routes.resolve("profile"),
  },
  {
    title: t("home.link.people.title"),
    description: t("home.link.people.description"),
    icon: "i-lucide-users",
    to: routes.resolve("people"),
  },
]);
</script>

<template>
  <div class="space-y-6">
    <BaseHeroSection
      :eyebrow="$wt('eyebrow')"
      :title="heroTitle"
      :description="$wt('summary')"
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
          {{ $wt("startLearning") }}
        </UButton>
        <UButton
          :to="routes.resolve('sets-create')"
          icon="i-lucide-plus"
          size="lg"
          variant="outline"
          color="neutral"
          class="justify-center"
        >
          {{ $wt("common.newSet") }}
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
        :eyebrow="$wt('quickAccess')"
        :title="$wt('keepPace')"
        :summary="$wt('everythingNearby')"
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
const { t } = useCmsWidgetI18n();
const routes = usePageRoutes();
const { stats, pending: statsPending } = useMyStats();
const { user, pending: userPending } = useCurrentUser();

const heroTitle = computed(() => {
  const firstName = user.value?.firstName?.trim();
  return firstName ? t("title.named", { name: firstName }) : t("title.default");
});

const overviewMetrics = computed(() => [
  {
    label: t("metric.people"),
    value: stats.value.peopleCount,
    icon: "i-lucide-users",
  },
  {
    label: t("metric.sets"),
    value: stats.value.mySetsCount,
    icon: "i-lucide-layers-3",
  },
  {
    label: t("metric.topics"),
    value: stats.value.myTopicsCount,
    icon: "i-lucide-book-open-text",
  },
]);

const quickLinks = computed(() => [
  {
    title: t("link.cards.title"),
    description: t("link.cards.description"),
    icon: "i-lucide-layers-3",
    to: routes.resolve("sets"),
  },
  {
    title: t("link.profile.title"),
    description: t("link.profile.description"),
    icon: "i-lucide-user-round-pen",
    to: routes.resolve("profile"),
  },
  {
    title: t("link.people.title"),
    description: t("link.people.description"),
    icon: "i-lucide-users",
    to: routes.resolve("people"),
  },
]);
const $wt = t;
</script>

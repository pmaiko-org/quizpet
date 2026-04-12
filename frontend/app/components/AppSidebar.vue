<template>
  <Transition name="slide-left">
    <aside
      v-if="sidebarVisible"
      class="sidebar"
    >
      <div class="sidebar__glow sidebar__glow--top" />
      <div class="sidebar__glow sidebar__glow--bottom" />

      <div class="sidebar__inner">
        <div class="sidebar__header">
          <div class="sidebar__actions">
            <UButton
              icon="i-lucide-sidebar-close"
              variant="ghost"
              color="neutral"
              class="rounded-2xl border border-default bg-elevated/70 shadow-sm cursor-pointer"
              @click="closeSidebar"
            />
          </div>
        </div>

        <client-only>
          <section class="sidebar__profile">
            <UUser
              :name="`${profile?.firstName || ''} ${profile?.lastName || ''}`"
              :description="profile?.email || ''"
              :avatar="{
              src: profile?.avatar,
              loading: 'lazy',
              icon: 'i-lucide-image',
            }"
              size="xl"
            />

            <div class="sidebar__metrics">
              <div
                v-for="metric in metrics"
                :key="metric.label"
                class="sidebar__metric"
              >
                <span class="sidebar__metric-value">{{ metric.value }}</span>
                <span class="sidebar__metric-label">{{ metric.label }}</span>
              </div>
            </div>
          </section>
        </client-only>

        <section class="sidebar__nav">
          <div class="sidebar__section-heading">
            <span>Навігація</span>
          </div>

          <UNavigationMenu
            :items="items"
            orientation="vertical"
            class="sidebar__menu"
            :ui="{
              root: 'min-w-0',
              list: 'flex flex-col gap-2',
              item: 'min-w-0',
              link: 'group relative overflow-hidden rounded-2xl border border-transparent bg-default/40 px-3 py-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-default hover:bg-elevated/90 hover:shadow-lg data-[active=true]:border-primary/30 data-[active=true]:bg-primary/10 data-[active=true]:shadow-[0_12px_30px_color-mix(in_oklab,var(--ui-primary)_18%,transparent)]',
              linkLeadingIcon: 'size-5 text-muted transition-colors duration-200 group-hover:text-default group-data-[active=true]:text-primary',
              linkLabel: 'truncate text-sm font-medium text-toned transition-colors duration-200 group-hover:text-highlighted group-data-[active=true]:text-highlighted',
              linkLabelExternalIcon: 'hidden',
              linkTrailingIcon: 'text-muted transition-colors duration-200 group-hover:text-default group-data-[active=true]:text-primary',
            }"
          />
        </section>

        <section class="sidebar__tip">
          <div>
            <p class="sidebar__tip-title">Ритм дня</p>
            <p class="sidebar__tip-text">
              Почни з карток, а потім перевір прогрес у статистиці.
            </p>
          </div>

          <UIcon
            name="i-lucide-sparkles"
            class="sidebar__tip-icon"
          />
        </section>
      </div>
    </aside>
  </Transition>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from "#ui/components/NavigationMenu.vue";

const items = ref<NavigationMenuItem[]>([
  {
    label: 'Головна',
    to: '/',
    icon: "i-lucide-home",
  },
  {
    label: 'Папки',
    to: '/folders',
    icon: "i-lucide-folder",
  },
  {
    label: 'Картки',
    to: '/cards',
    icon: "i-lucide-layers",
  },
  {
    label: 'Статистика',
    to: '/statistic',
    icon: "i-lucide-bar-chart-3",
  },
  {
    label: 'Люди',
    to: '/peoples',
    icon: "i-lucide-users",
  }
]);

const metrics = [
  { value: "12", label: "Теми" },
  { value: "48", label: "Картки" },
  { value: "92%", label: "Фокус" },
];

const { sidebarVisible, closeSidebar } = useUiStore();

const { profile } = useProfileStore()
</script>

<style>
@reference "~/assets/css/main.css";

.sidebar {
  @apply fixed
  w-xs
  xl:sticky
  xl:h-screen
  xl:bottom-auto
  z-51
  top-0
  left-0
  bottom-0
  isolate
  overflow-x-hidden
  overflow-y-auto
  overscroll-y-contain
  bg-[radial-gradient(circle_at_top,color-mix(in_oklab,var(--ui-primary)_10%,transparent),transparent_26%),linear-gradient(180deg,color-mix(in_oklab,var(--ui-bg)_92%,white_8%),var(--ui-bg))]
  text-default
  shadow-[0_24px_80px_color-mix(in_oklab,var(--ui-text-muted)_20%,transparent)]
  backdrop-blur-xl
  border-r
  border-default
  will-change-transform;
}

.sidebar__inner {
  @apply relative flex min-h-full flex-col gap-5 px-4 pb-5 pt-0;
}

.sidebar__header {
  @apply flex items-center justify-between gap-3 h-(--ui-header-height);
}

.sidebar__actions {
  @apply flex items-center gap-2;
}

.sidebar__profile {
  @apply rounded-[28px] border border-default bg-elevated/70 p-4 shadow-lg backdrop-blur;
}

.sidebar__metrics {
  @apply mt-4 grid grid-cols-3 gap-2;
}

.sidebar__metric {
  @apply rounded-2xl bg-default/80 px-3 py-2 text-center;
}

.sidebar__metric-value {
  @apply block text-sm font-semibold text-highlighted;
}

.sidebar__metric-label {
  @apply mt-1 block text-[11px] uppercase tracking-[0.18em] text-muted;
}

.sidebar__nav {
  @apply rounded-[28px] border border-default bg-elevated/75 p-3 shadow-lg backdrop-blur;
}

.sidebar__section-heading {
  @apply mb-2 flex items-center justify-between px-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted;
}

.sidebar__menu {
  @apply rounded-2xl;
}

.sidebar__tip {
  @apply mt-auto flex items-start justify-between gap-3 rounded-[28px] border border-primary/20 bg-[linear-gradient(135deg,color-mix(in_oklab,var(--ui-primary)_14%,var(--ui-bg-elevated)),var(--ui-bg-elevated))] px-4 py-4 text-default shadow-lg;
}

.sidebar__tip-title {
  @apply text-sm font-semibold;
}

.sidebar__tip-text {
  @apply mt-1 text-sm leading-6 text-toned;
}

.sidebar__tip-icon {
  @apply mt-0.5 size-5 shrink-0 text-primary;
}

.sidebar__glow {
  @apply pointer-events-none absolute blur-3xl;
}

.sidebar__glow--top {
  @apply -left-12 top-10 h-28 w-28 rounded-full bg-primary/16;
}

.sidebar__glow--bottom {
  @apply bottom-16 right-[-2.5rem] h-36 w-36 rounded-full bg-primary/10;
}
</style>

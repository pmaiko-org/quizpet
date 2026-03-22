<template>
  <UHeader
    :toggle="false"
    class="app-header"
  >
    <template #left>
      <div class="app-header__left">
        <UButton
          icon="i-lucide-menu"
          variant="ghost"
          color="neutral"
          class="app-header__menu-button"
          @click="toggleSidebar"
        />

        <NuxtLink
          to="/"
          class="app-header__brand"
        >
          <span class="app-header__brand-mark">Q</span>
          <span>
            <span class="app-header__brand-label">QuizPet</span>
            <span class="app-header__brand-caption">Панель навчання</span>
          </span>
        </NuxtLink>
      </div>
    </template>

    <template #right>
      <div class="app-header__right">
        <div class="app-header__status">
          <span class="app-header__status-dot" />
          <span>Focus mode</span>
        </div>

        <UColorModeSwitch />
      </div>
    </template>
  </UHeader>
</template>

<script setup lang="ts">
const { toggleSidebar } = useUiStore();
</script>

<style>
@reference "~/assets/css/main.css";

.app-header {
  @apply sticky top-0 z-40 border-b border-default bg-[radial-gradient(circle_at_top,color-mix(in_oklab,var(--ui-primary)_10%,transparent),transparent_26%),linear-gradient(180deg,color-mix(in_oklab,var(--ui-bg)_92%,white_8%),var(--ui-bg))] shadow-[0_24px_80px_color-mix(in_oklab,var(--ui-text-muted)_12%,transparent)] backdrop-blur-xl;
}

.app-header__left {
  @apply flex items-center gap-3;
}

.app-header__menu-button {
  @apply rounded-2xl border border-default bg-elevated/70 shadow-sm cursor-pointer;
}

.app-header__brand {
  @apply inline-flex items-center gap-3 rounded-2xl px-2 py-1.5 transition-colors hover:bg-elevated/70;
}

.app-header__brand-mark {
  @apply flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-sm font-semibold text-inverted shadow-lg;
}

.app-header__brand-label {
  @apply block text-sm font-semibold text-highlighted;
}

.app-header__brand-caption {
  @apply block text-xs text-muted;
}

.app-header__right {
  @apply flex items-center gap-3;
}

.app-header__status {
  @apply hidden items-center gap-2 rounded-full border border-default bg-elevated/70 px-3 py-1.5 text-xs font-medium text-toned shadow-sm sm:inline-flex;
}

.app-header__status-dot {
  @apply h-2 w-2 rounded-full bg-primary shadow-[0_0_0_4px_color-mix(in_oklab,var(--ui-primary)_16%,transparent)];
}
</style>

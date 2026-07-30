<template>
  <USidebar
    v-model:open="open"
    variant="sidebar"
    collapsible="offcanvas"
    side="left"
    :ui="{
      container: 'h-full p-0',
    }"
    class="border-r border-default bg-elevated/95 [--sidebar-width:18rem]"
  >
    <section class="flex flex-col">
      <UNavigationMenu
        :items="items"
        orientation="vertical"
        :ui="{
          root: 'min-w-0',
          list: 'flex flex-col gap-1',
          item: 'min-w-0',
          link: 'group relative overflow-hidden app-radius-control border border-transparent px-3 py-2.5 transition-colors duration-150 hover:bg-muted data-[active=true]:border-primary/15 data-[active=true]:bg-primary/10',
          linkLeadingIcon:
            'size-5 text-muted transition-colors duration-200 group-hover:text-default group-data-[active=true]:text-primary',
          linkLabel:
            'truncate text-sm font-medium text-toned transition-colors duration-200 group-hover:text-highlighted group-data-[active=true]:text-highlighted',
          linkLabelExternalIcon: 'hidden',
          linkTrailingIcon:
            'text-muted transition-colors duration-200 group-hover:text-default group-data-[active=true]:text-primary',
        }"
        @click="closeOnMobile"
      />

      <UButton
        to="/sets/create"
        color="primary"
        variant="soft"
        icon="i-lucide-plus"
        block
        class="mt-3 justify-start"
        @click="closeOnMobile"
      >
        Новий набір
      </UButton>
    </section>

    <client-only>
      <TheSidebarProfileSkeleton v-if="profilePending || statsPending" />

      <section
        v-else
        class="mt-auto border-t border-default pt-3"
      >
        <div class="app-radius-surface border border-default bg-muted/45 p-3">
          <div class="mb-2 flex items-center justify-between gap-2">
            <p class="text-xs font-medium text-muted">
              Профіль
            </p>
            <UButton
              to="/profile"
              color="neutral"
              variant="ghost"
              icon="i-lucide-settings-2"
              size="sm"
              aria-label="Редагувати профіль"
              @click="closeOnMobile"
            />
          </div>

          <UUser
            :name="`${profile?.firstName || ''} ${profile?.lastName || ''}`"
            :description="profile?.email || ''"
            :avatar="{
              src: profile?.avatar,
              loading: 'lazy',
              icon: 'i-lucide-image',
            }"
            size="md"
            class="min-w-0"
            :ui="{
              root: 'min-w-0',
              wrapper: 'min-w-0',
              name: 'truncate',
              description: 'truncate',
            }"
          />

          <div class="mt-3 flex items-center gap-3 text-xs text-muted">
            <span
              v-for="metric in metrics"
              :key="metric.label"
              class="min-w-0"
            >
              <strong class="font-semibold text-highlighted">
                {{ metric.value }}
              </strong>
              {{ metric.label.toLowerCase() }}
            </span>
          </div>

          <div class="mt-3 border-t border-default pt-2">
            <UButton
              color="neutral"
              variant="ghost"
              icon="i-lucide-log-out"
              size="sm"
              block
              class="justify-start"
              :loading="isLoggingOut"
              @click="doLogout"
            >
              Вийти
            </UButton>
          </div>
        </div>
      </section>

      <template #fallback>
        <TheSidebarProfileSkeleton />
      </template>
    </client-only>
  </USidebar>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from "#ui/components/NavigationMenu.vue";

const open = defineModel<boolean>({ required: true });
const authStore = useAuthStore();
const { isLoggingOut } = storeToRefs(authStore);
const { doLogout } = authStore;

const closeOnMobile = () => {
  if (import.meta.client && window.matchMedia("(max-width: 1023px)").matches) {
    open.value = false;
  }
};

const items = ref<NavigationMenuItem[]>([
  {
    label: "Головна",
    to: "/",
    icon: "i-lucide-home",
  },
  {
    label: "Папки",
    to: "/folders",
    icon: "i-lucide-folder",
  },
  {
    label: "Картки",
    to: "/sets",
    icon: "i-lucide-layers",
  },
  {
    label: "Статистика",
    to: "/statistic",
    icon: "i-lucide-bar-chart-3",
  },
  {
    label: "Люди",
    to: "/peoples",
    icon: "i-lucide-users",
  },
]);

const { user: profile, pending: profilePending } = useCurrentUser();

const { stats, pending: statsPending } = useMyStats();

const metrics = computed(() => [
  { value: stats.value.peopleCount, label: "Люди" },
  { value: stats.value.mySetsCount, label: "Набори" },
  { value: stats.value.myTopicsCount, label: "Теми" },
]);
</script>

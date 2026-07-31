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
    <section class="mb-auto flex flex-col gap-4">
      <NuxtLink
        :to="{ name: RouteName.SETS_CREATE }"
        class="
          group flex items-center gap-3 rounded-md border border-default
          bg-linear-to-br from-primary/10 to-transparent p-3 transition-colors
          hover:border-primary/25
        "
        @click="closeOnMobile"
      >
        <span
          class="
            flex size-10 shrink-0 items-center justify-center rounded-sm
            bg-primary text-inverted shadow-sm transition-transform duration-200
            group-hover:scale-105
          "
        >
          <UIcon
            name="i-lucide-plus"
            class="size-5"
          />
        </span>
        <span class="min-w-0">
          <span class="block truncate text-sm font-semibold text-highlighted">
            Новий набір
          </span>
          <span class="block truncate text-[11px] text-muted">
            Створити картки для навчання
          </span>
        </span>
      </NuxtLink>

      <div class="flex flex-col gap-1.5">
        <p
          class="
            px-3 text-[11px] font-semibold tracking-wider text-dimmed uppercase
          "
        >
          Меню
        </p>
        <UNavigationMenu
          :items="items"
          orientation="vertical"
          :ui="{
            root: 'min-w-0',
            list: 'flex flex-col gap-1',
            item: 'min-w-0',
            link: 'group relative overflow-hidden rounded-sm border border-transparent px-3 py-2.5 transition-colors duration-150 hover:bg-muted data-[active=true]:border-primary/15 data-[active=true]:bg-primary/10',
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
      </div>
    </section>

    <client-only>
      <TheSidebarProfileSkeleton v-if="profilePending || statsPending" />

      <section
        v-else
        class="border-t border-default pt-3"
      >
        <div class="rounded-md border border-default bg-muted/45 p-3">
          <div class="mb-2 flex items-center justify-between gap-2">
            <p class="text-xs font-medium text-muted">
              Профіль
            </p>
            <UButton
              :to="{ name: RouteName.PROFILE }"
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
import { RouteName } from "~/constants";

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
    to: { name: RouteName.INDEX },
    icon: "i-lucide-home",
  },
  {
    label: "Папки",
    to: { name: RouteName.FOLDERS },
    icon: "i-lucide-folder",
  },
  {
    label: "Картки",
    to: { name: RouteName.SETS },
    icon: "i-lucide-layers",
  },
  {
    label: "Статистика",
    to: { name: RouteName.STATISTIC },
    icon: "i-lucide-bar-chart-3",
  },
  {
    label: "Люди",
    to: { name: RouteName.PEOPLES },
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

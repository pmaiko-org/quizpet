<template>
  <USidebar
    v-model:open="open"
    variant="sidebar"
    collapsible="offcanvas"
    side="left"
    :ui="{
      container: 'h-full',
    }"
    class="[--sidebar-width:var(--container-xs)]"
  >
    <client-only>
      <section
        class="
          rounded-[28px] border border-default bg-elevated/70 p-4 shadow-lg
          backdrop-blur-sm
        "
      >
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

        <div class="mt-4 grid grid-cols-3 gap-2">
          <div
            v-for="metric in metrics"
            :key="metric.label"
            class="rounded-2xl bg-default/80 px-3 py-2 text-center"
          >
            <span class="block text-sm font-semibold text-highlighted">{{
              metric.value
            }}</span>
            <span
              class="
                mt-1 block text-[11px] tracking-[0.18em] text-muted uppercase
              "
            >{{ metric.label }}</span>
          </div>
        </div>
      </section>
    </client-only>

    <section
      class="
        rounded-[28px] border border-default bg-elevated/75 p-3 shadow-lg
        backdrop-blur-sm
      "
    >
      <div
        class="
          mb-2 flex items-center justify-between px-2 text-[11px] font-semibold
          tracking-[0.2em] text-muted uppercase
        "
      >
        <span>Навігація</span>
      </div>

      <UNavigationMenu
        :items="items"
        orientation="vertical"
        class="rounded-2xl"
        :ui="{
          root: 'min-w-0',
          list: 'flex flex-col gap-2',
          item: 'min-w-0',
          link: 'group relative overflow-hidden rounded-2xl border border-transparent bg-default/40 px-3 py-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-default hover:bg-elevated/90 hover:shadow-lg data-[active=true]:border-primary/30 data-[active=true]:bg-primary/10 data-[active=true]:shadow-[0_12px_30px_color-mix(in_oklab,var(--ui-primary)_18%,transparent)]',
          linkLeadingIcon:
            'size-5 text-muted transition-colors duration-200 group-hover:text-default group-data-[active=true]:text-primary',
          linkLabel:
            'truncate text-sm font-medium text-toned transition-colors duration-200 group-hover:text-highlighted group-data-[active=true]:text-highlighted',
          linkLabelExternalIcon: 'hidden',
          linkTrailingIcon:
            'text-muted transition-colors duration-200 group-hover:text-default group-data-[active=true]:text-primary',
        }"
      />
    </section>

    <section
      class="
        mt-auto flex items-start justify-between gap-3 rounded-[28px] border
        border-primary/20
        bg-[linear-gradient(135deg,color-mix(in_oklab,var(--ui-primary)_14%,var(--ui-bg-elevated)),var(--ui-bg-elevated))]
        p-4 text-default shadow-lg
      "
    >
      <div>
        <p class="text-sm font-semibold">
          Ритм дня
        </p>
        <p class="mt-1 text-sm/6 text-toned">
          Почни з карток, а потім перевір прогрес у статистиці.
        </p>
      </div>

      <UIcon
        name="i-lucide-sparkles"
        class="mt-0.5 size-5 shrink-0 text-primary"
      />
    </section>
  </USidebar>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from "#ui/components/NavigationMenu.vue";

const open = defineModel<boolean>({ required: true });

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
    to: "/cards",
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

const metrics = [
  { value: "12", label: "Теми" },
  { value: "48", label: "Картки" },
  { value: "92%", label: "Фокус" },
];

const { profile } = useProfileStore();
</script>

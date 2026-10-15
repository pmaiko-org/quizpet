<template>
  <UHeader
    :toggle="false"
    class="
      sticky top-0 z-40 border-b border-default bg-default/88 backdrop-blur-xl
    "
  >
    <template #left>
      <div class="flex min-w-0 items-center gap-2">
        <UButton
          v-if="showSidebarToggle"
          icon="i-lucide-panel-left"
          variant="ghost"
          color="neutral"
          size="sm"
          :aria-label="$t('common.openSidebar')"
          class="cursor-pointer rounded-md border border-default bg-elevated/70"
          @click="handleToggleSidebar"
        />

        <NuxtLink
          :to="routes.resolve(isLoggedIn ? 'cabinet' : 'index')"
          class="
            inline-flex min-w-0 items-center gap-2 rounded-md px-1.5 py-1
            transition-colors
            hover:bg-elevated/70
          "
        >
          <img
            v-if="global?.logo?.url"
            :src="global.logo.url"
            :alt="global.siteName"
            class="size-8 rounded-md object-contain"
          >
          <span
            v-else
            class="
              flex size-8 items-center justify-center rounded-md bg-primary
              text-xs font-bold text-inverted
            "
          >Q</span>
          <span class="min-w-0">
            <span
              class="block truncate text-sm font-semibold text-highlighted"
            >{{ global?.siteName }}</span>
            <span class="block truncate text-[11px] text-muted">{{
              $t("common.flashcardLearning")
            }}</span>
          </span>
        </NuxtLink>
      </div>
    </template>

    <template #right>
      <div
        class="
          flex shrink-0 items-center gap-2
          sm:gap-3
        "
      >
        <div
          class="
            hidden items-center gap-2 rounded-full border border-default px-3
            py-1.5 text-xs font-medium text-toned
            sm:inline-flex
          "
        >
          <UIcon
            :name="sectionIcon"
            class="size-3.5 text-primary"
          />
          <span>{{ sectionLabel }}</span>
        </div>

        <UColorModeSwitch />
        <LocaleSwitcher />
      </div>
    </template>
  </UHeader>
</template>

<script setup lang="ts">
const open = defineModel<boolean>({ required: false });

const { showSidebarToggle = true } = defineProps<{
  showSidebarToggle?: boolean;
}>();

const routes = usePageRoutes();
const { bootstrap } = useCmsBootstrap();
const { page } = useCmsPage();
const { isLoggedIn } = storeToRefs(useAuthStore());
const { t } = useI18n();
const global = computed(() => bootstrap.value?.global);

const handleToggleSidebar = () => {
  open.value = !open.value;
};

const isLearning = computed(
  () =>
    page.value?.routeName === "sets-id-learn" ||
    page.value?.routeName === "sets-id-match",
);
const sectionLabel = computed(() =>
  isLearning.value ? t("common.studyMode") : t("common.studySpace"),
);
const sectionIcon = computed(() =>
  isLearning.value ? "i-lucide-focus" : "i-lucide-sparkles",
);
</script>

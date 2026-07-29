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
          aria-label="Відкрити або закрити бокову панель"
          class="
            app-radius-surface cursor-pointer border border-default
            bg-elevated/70
          "
          @click="open = !open"
        />

        <NuxtLink
          to="/"
          class="
            app-radius-surface inline-flex min-w-0 items-center gap-2 px-1.5
            py-1 transition-colors
            hover:bg-elevated/70
          "
        >
          <span
            class="
              app-radius-surface flex size-8 items-center justify-center
              bg-primary text-xs font-bold text-inverted
            "
          >Q</span>
          <span class="min-w-0">
            <span class="block truncate text-sm font-semibold text-highlighted">QuizPet</span>
            <span class="block truncate text-[11px] text-muted">{{
              sectionLabel
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
      </div>
    </template>
  </UHeader>
</template>

<script setup lang="ts">
import { PageName } from "~/constants";

const open = defineModel<boolean>({ required: false });

const { showSidebarToggle = true } = defineProps<{
  showSidebarToggle?: boolean;
}>();

const route = useRoute();

const isLearning = computed(() => route.name === PageName.SETS_ID_LEARN);
const sectionLabel = computed(() =>
  isLearning.value ? "Режим навчання" : "Навчальний простір",
);
const sectionIcon = computed(() =>
  isLearning.value ? "i-lucide-focus" : "i-lucide-sparkles",
);
</script>

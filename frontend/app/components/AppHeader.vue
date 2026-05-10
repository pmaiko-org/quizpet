<template>
  <UHeader
    :toggle="false"
    class="
      backdrop-blur-xl; sticky top-0 z-40 border-b border-default
      bg-[radial-gradient(circle_at_top,color-mix(in_oklab,var(--ui-primary)_10%,transparent),transparent_26%),linear-gradient(180deg,color-mix(in_oklab,var(--ui-bg)_92%,white_8%),var(--ui-bg))]
      shadow-[0_24px_80px_color-mix(in_oklab,var(--ui-text-muted)_12%,transparent)]
    "
  >
    <template #left>
      <div class="flex items-center gap-3">
        <UButton
          icon="i-lucide-panel-left"
          variant="ghost"
          color="neutral"
          class="
            cursor-pointer rounded-2xl border border-default bg-elevated/70
            shadow-sm
          "
          @click="open = !open"
        />

        <NuxtLink
          to="/"
          class="
            inline-flex items-center gap-3 rounded-2xl px-2 py-1.5
            transition-colors
            hover:bg-elevated/70
          "
        >
          <span
            class="
              flex size-10 items-center justify-center rounded-2xl bg-primary
              text-sm font-semibold text-inverted shadow-lg
            "
          >Q</span>
          <span>
            <span class="block text-sm font-semibold text-highlighted">QuizPet</span>
            <span class="block text-xs text-muted">Панель навчання</span>
          </span>
        </NuxtLink>
      </div>
    </template>

    <template #right>
      <div class="flex items-center gap-3">
        <div
          class="
            hidden items-center gap-2 rounded-full border border-default
            bg-elevated/70 px-3 py-1.5 text-xs font-medium text-toned shadow-sm
            sm:inline-flex
          "
        >
          <span
            class="
              shadow-[0_0_0_4px_color-mix(in_oklab,var(--ui-primary)_16%,transparent)];
              size-2 rounded-full bg-primary
            "
          />
          <span>Focus mode</span>
        </div>

        <UColorModeSwitch />
      </div>
    </template>
  </UHeader>
</template>

<script setup lang="ts">
const open = defineModel<boolean>({ required: false });
</script>

<template>
  <nav :aria-label="$t('common.breadcrumbs')">
    <ol class="flex flex-wrap items-center gap-2 text-sm text-muted">
      <li
        v-for="(item, index) in items"
        :key="`${item.path}:${index}`"
        class="flex items-center gap-2"
      >
        <UIcon
          v-if="index > 0"
          name="i-lucide-chevron-right"
          class="size-3.5 text-dimmed"
          aria-hidden="true"
        />
        <span
          v-if="index === items.length - 1"
          aria-current="page"
          class="font-medium text-highlighted"
        >
          {{ item.title }}
        </span>
        <NuxtLink
          v-else
          :to="item.path"
          class="
            rounded-sm transition-colors
            hover:text-highlighted
          "
        >
          {{ item.title }}
        </NuxtLink>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
defineProps<{
  items: Array<{ title: string; path: string }>;
}>();
</script>

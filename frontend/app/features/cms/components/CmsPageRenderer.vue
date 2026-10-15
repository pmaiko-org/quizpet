<template>
  <div
    class="cms-page"
    :class="`
      cms-page--${page.layout}
    `"
  >
    <UContainer
      v-if="showBreadcrumbs"
      class="cms-page__breadcrumbs"
      :class="{ [CONTAINERLESS]: isCabinet }"
    >
      <BaseBreadcrumbs :items="page.breadcrumbs" />
    </UContainer>

    <div
      class="cms-page__widgets"
      :class="{ 'cms-page__widgets--flush': isFlush }"
    >
      <UContainer
        v-for="item in widgets"
        :key="item.key"
        :class="{ [CONTAINERLESS]: item.frame === 'full' || isCabinet }"
      >
        <component
          :is="item.component"
          v-bind="item.props"
        />
      </UContainer>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TCmsPageResolveResponse } from "~/core/cms/types";

import { findCmsWidget } from "../registry/widgetRegistry";

const CONTAINERLESS = "max-w-none px-0 sm:px-0 lg:px-0";

const { page } = defineProps<{
  page: TCmsPageResolveResponse["page"];
}>();

const isCabinet = computed(() => page.layout === "cabinet");
const isFlush = computed(() => page.routeName === "login");
const showBreadcrumbs = computed(
  () => page.showBreadcrumbs && page.breadcrumbs.length > 1,
);

const unknownWidgets = new Set<string>();

const widgets = computed(() =>
  page.blocks.flatMap((block) => {
    const definition = findCmsWidget(block.__component);

    if (!definition) {
      if (!unknownWidgets.has(block.__component)) {
        unknownWidgets.add(block.__component);
        console.error(`Unknown CMS widget: ${block.__component}`);
      }

      return [];
    }

    const { id, __component: uid, ...props } = block;
    return [{ key: `${uid}:${id}`, props, ...definition }];
  }),
);
</script>

<style scoped>
.cms-page {
  --cms-widget-gap: clamp(4rem, 8vw, 7rem);
  --cms-page-bottom: clamp(4rem, 8vw, 7rem);
}

.cms-page--cabinet {
  --cms-widget-gap: 1.5rem;
  --cms-page-bottom: 0;
}

.cms-page__breadcrumbs {
  padding-block-end: 1.5rem;
}

.cms-page--default .cms-page__breadcrumbs,
.cms-page--landing .cms-page__breadcrumbs,
.cms-page--empty .cms-page__breadcrumbs {
  padding-block-start: 2rem;
}

.cms-page__widgets {
  display: flex;
  flex-direction: column;
  gap: var(--cms-widget-gap);
  padding-block-end: var(--cms-page-bottom);
}

.cms-page__widgets--flush {
  gap: 0;
  padding-block-end: 0;
}
</style>

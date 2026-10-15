<template>
  <section>
    <div
      class="cms-rich-text space-y-5 text-lg/8 text-toned"
      :class="widthClass"
    >
      <RichTextNode
        v-for="(node, index) in body"
        :key="index"
        :node="node"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import type { TCmsBlocksNode } from "~/core/cms/types";

const { body, width } = defineProps<{
  body: TCmsBlocksNode[];
  width: "narrow" | "default" | "full";
}>();

const widthClass = computed(() => ({
  "mx-auto max-w-3xl": width === "narrow",
  "mx-auto max-w-5xl": width === "default",
  "max-w-none": width === "full",
}));
</script>

<style scoped>
.cms-rich-text :deep(h2),
.cms-rich-text :deep(h3),
.cms-rich-text :deep(h4) {
  color: var(--ui-text-highlighted);
  font-weight: 600;
}

.cms-rich-text :deep(h2) {
  font-size: 1.5rem;
}

.cms-rich-text :deep(ul),
.cms-rich-text :deep(ol) {
  padding-left: 1.25rem;
}

.cms-rich-text :deep(ul) {
  list-style: disc;
}

.cms-rich-text :deep(ol) {
  list-style: decimal;
}

.cms-rich-text :deep(a) {
  color: var(--ui-primary);
  text-decoration: underline;
}
</style>

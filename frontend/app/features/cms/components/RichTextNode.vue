<template>
  <component
    :is="tag"
    :href="href"
    :rel="rel"
    :class="classes"
  >
    <template v-if="node.type === 'text'">
      {{ text }}
    </template>
    <RichTextNode
      v-for="(child, index) in children"
      v-else
      :key="index"
      :node="child"
    />
  </component>
</template>

<script setup lang="ts">
import type { TCmsBlocksNode, TCmsTextNode } from "~/core/cms/types";

defineOptions({ name: "RichTextNode" });

const SAFE_LINK_PROTOCOLS = ["http:", "https:", "mailto:", "tel:"];
const MIN_HEADING_LEVEL = 1;
const MAX_HEADING_LEVEL = 6;

const { node } = defineProps<{
  node: TCmsBlocksNode | TCmsTextNode;
}>();

const isTextNode = (
  value: TCmsBlocksNode | TCmsTextNode,
): value is TCmsTextNode => value.type === "text";

const safeHref = (url: string | undefined) => {
  if (!url) {
    return undefined;
  }

  if (url.startsWith("/") && !url.startsWith("//")) {
    return url;
  }

  try {
    return SAFE_LINK_PROTOCOLS.includes(new URL(url).protocol)
      ? url
      : undefined;
  } catch {
    return undefined;
  }
};

const text = computed(() => (isTextNode(node) ? node.text : ""));
const children = computed(() =>
  isTextNode(node) ? [] : (node.children ?? []),
);

const href = computed(() =>
  !isTextNode(node) && node.type === "link" ? safeHref(node.url) : undefined,
);
const rel = computed(() =>
  href.value?.startsWith("http") ? "noopener noreferrer" : undefined,
);

const headingLevel = computed(() => {
  if (isTextNode(node) || node.type !== "heading") {
    return MIN_HEADING_LEVEL;
  }

  return Math.min(
    Math.max(node.level ?? 2, MIN_HEADING_LEVEL),
    MAX_HEADING_LEVEL,
  );
});

const tag = computed(() => {
  if (isTextNode(node)) {
    if (node.code) return "code";
    if (node.bold) return "strong";
    if (node.italic) return "em";
    return "span";
  }

  if (node.type === "heading") return `h${headingLevel.value}`;
  if (node.type === "list") return node.format === "ordered" ? "ol" : "ul";
  if (node.type === "list-item") return "li";
  if (node.type === "quote") return "blockquote";
  if (node.type === "code") return "pre";
  if (node.type === "link") return href.value ? "a" : "span";
  return "p";
});

const classes = computed(() => ({
  "underline": isTextNode(node) && node.underline,
  "line-through": isTextNode(node) && node.strikethrough,
  "font-bold": isTextNode(node) && node.bold && tag.value !== "strong",
  "italic": isTextNode(node) && node.italic && tag.value !== "em",
}));
</script>

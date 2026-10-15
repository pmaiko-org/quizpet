<template>
  <section>
    <div
      class="
        mx-auto max-w-5xl rounded-2xl border p-6 shadow-sm
        sm:p-8
      "
      :class="variantClass"
    >
      <div class="flex items-start gap-4">
        <UIcon
          v-if="icon"
          :name="icon"
          class="mt-1 size-6 shrink-0"
        />
        <div class="min-w-0 flex-1">
          <h2
            class="
              text-2xl font-semibold text-highlighted
              sm:text-3xl
            "
          >
            {{ title }}
          </h2>
          <div class="mt-2 space-y-3 text-toned">
            <RichTextNode
              v-for="(node, index) in body"
              :key="index"
              :node="node"
            />
          </div>
          <div
            v-if="primaryLink || secondaryLink"
            class="mt-5 flex flex-wrap gap-3"
          >
            <UButton
              v-if="primaryLink"
              :to="primaryLink.path"
              :target="primaryLink.isExternal ? '_blank' : undefined"
              :rel="primaryLink.isExternal ? 'noopener noreferrer' : undefined"
              :icon="primaryLink.icon ?? undefined"
            >
              {{ primaryLink.label }}
            </UButton>
            <UButton
              v-if="secondaryLink"
              :to="secondaryLink.path"
              :target="secondaryLink.isExternal ? '_blank' : undefined"
              :rel="
                secondaryLink.isExternal ? 'noopener noreferrer' : undefined
              "
              :icon="secondaryLink.icon ?? undefined"
              color="neutral"
              variant="outline"
            >
              {{ secondaryLink.label }}
            </UButton>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { TCmsBlocksNode, TCmsLink } from "~/core/cms/types";

const { title, body, variant, icon, primaryLink, secondaryLink } = defineProps<{
  title: string;
  body: TCmsBlocksNode[];
  variant: "info" | "success" | "warning" | "error";
  icon?: string | null;
  primaryLink?: TCmsLink | null;
  secondaryLink?: TCmsLink | null;
}>();

const variantClass = computed(() => ({
  "border-info/30 bg-info/5 text-info": variant === "info",
  "border-success/30 bg-success/5 text-success": variant === "success",
  "border-warning/30 bg-warning/5 text-warning": variant === "warning",
  "border-error/30 bg-error/5 text-error": variant === "error",
}));
</script>

<template>
  <button
    type="button"
    class="
      relative flex min-h-20 w-full items-center justify-center gap-2 rounded-md
      border-2 px-3 py-4 text-center text-sm font-medium transition-colors
      focus-visible:outline-2 focus-visible:outline-offset-4
      focus-visible:outline-primary
      motion-reduce:transition-none
      sm:min-h-24 sm:px-5 sm:text-base
    "
    :class="stateClasses"
    :disabled="matched && !feedback"
    :aria-pressed="selected"
    :aria-disabled="locked || matched"
    :aria-label="matched ? `${text}: matched` : undefined"
    @click="handleSelect"
  >
    <span class="min-w-0 wrap-anywhere whitespace-pre-wrap">{{ text }}</span>
    <UIcon
      v-if="matched || feedback"
      :name="feedback === 'error' ? 'i-lucide-x' : 'i-lucide-check'"
      class="size-4 shrink-0"
    />
  </button>
</template>

<script setup lang="ts">
import type { TMatchFeedback } from "../../matching";

const {
  text,
  selected = false,
  matched = false,
  locked = false,
  feedback = null,
} = defineProps<{
  text: string;
  selected?: boolean;
  matched?: boolean;
  locked?: boolean;
  feedback?: TMatchFeedback | null;
}>();

const emit = defineEmits<{ select: [] }>();

const stateClasses = computed(() => {
  if (feedback === "error") {
    return "border-error bg-error/10 text-error";
  }
  if (feedback === "success" || matched) {
    return "border-success/40 bg-success/10 text-success disabled:opacity-45";
  }
  if (selected) {
    return "border-primary bg-primary/10 text-primary";
  }
  return "border-default bg-elevated text-highlighted hover:border-primary/50 hover:bg-primary/5";
});

const handleSelect = () => {
  if (!locked && !matched) {
    emit("select");
  }
};
</script>

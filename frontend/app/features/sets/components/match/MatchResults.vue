<template>
  <section
    class="
      rounded-md border border-default bg-elevated/70 p-6 text-center
      sm:p-10
    "
  >
    <div
      class="
        mx-auto flex size-16 items-center justify-center rounded-full
        bg-success/10 text-success
      "
    >
      <UIcon
        name="i-lucide-trophy"
        class="size-8"
      />
    </div>
    <h2
      ref="heading"
      tabindex="-1"
      class="
        mt-5 text-2xl font-semibold text-highlighted
        focus:outline-none
      "
    >
      Every pair matched!
    </h2>
    <p class="mt-2 text-sm text-toned">
      {{ setName }}
    </p>
    <BaseMetricGrid
      class="mx-auto mt-6 max-w-2xl"
      :items="metrics"
      columns="four"
    />
    <div class="mt-6 flex flex-wrap justify-center gap-3">
      <UButton
        icon="i-lucide-rotate-ccw"
        size="lg"
        @click="emit('restart')"
      >
        Play again
      </UButton>
      <UButton
        :to="{ name: RouteName.SETS_ID_LEARN, params: { id: setId } }"
        icon="i-lucide-layers-3"
        variant="outline"
        color="neutral"
        size="lg"
      >
        Continue with Learn
      </UButton>
    </div>
  </section>
</template>

<script setup lang="ts">
import { RouteName } from "~/shared/constants";

import { formatTime } from "../../utils";

const { setId, setName, matchedCount, mistakes, elapsedMs, accuracy } =
  defineProps<{
    setId: string;
    setName: string;
    matchedCount: number;
    mistakes: number;
    elapsedMs: number;
    accuracy: number;
  }>();
const emit = defineEmits<{ restart: [] }>();
const heading = useTemplateRef("heading");
const metrics = computed(() => [
  { label: "Pairs matched", value: matchedCount },
  { label: "Time", value: formatTime(elapsedMs) },
  { label: "Mistakes", value: mistakes },
  { label: "Accuracy", value: `${accuracy}%` },
]);
onMounted(() => heading.value?.focus());
</script>

<template>
  <div
    :class="gridClass"
    :aria-busy="pending"
  >
    <UCard
      v-for="item in items"
      :key="item.label"
      :ui="itemUi"
    >
      <div :class="itemClass">
        <template v-if="pending">
          <div
            v-if="variant === 'hero'"
            class="flex items-center justify-between gap-3"
          >
            <div class="flex-1 space-y-2">
              <USkeleton class="h-3 w-16" />
              <USkeleton class="h-7 w-12" />
            </div>
            <USkeleton
              class="
                hidden size-9
                sm:block
              "
            />
          </div>

          <div
            v-else
            class="space-y-2"
          >
            <USkeleton class="h-3 w-20" />
            <USkeleton class="h-5 w-12" />
          </div>
        </template>

        <template v-else-if="variant === 'hero'">
          <div class="flex items-center justify-between gap-3">
            <div>
              <p class="text-xs font-medium text-toned">
                {{ item.label }}
              </p>
              <p class="mt-1 text-2xl font-semibold text-highlighted">
                {{ item.value }}
              </p>
            </div>

            <div
              v-if="item.icon"
              class="
                app-radius-surface hidden size-9 items-center justify-center
                bg-primary/10 text-primary
                sm:flex
              "
            >
              <UIcon
                :name="item.icon"
                class="size-5"
              />
            </div>
          </div>
        </template>

        <template v-else-if="variant === 'compact'">
          <p class="block text-base font-semibold text-highlighted">
            {{ item.value }}
          </p>
          <p
            class="mt-0.5 block text-[9px] tracking-normal text-muted uppercase"
          >
            {{ item.label }}
          </p>
        </template>

        <template v-else>
          <p
            class="
              text-[10px] font-semibold tracking-[0.12em] text-muted uppercase
            "
          >
            {{ item.label }}
          </p>
          <p class="mt-1 text-base font-semibold text-highlighted">
            {{ item.value }}
          </p>
          <p
            v-if="item.description"
            class="mt-2 text-sm/6 text-toned"
          >
            {{ item.description }}
          </p>
        </template>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
interface IBaseMetricGridItem {
  label: string;
  value: number | string;
  description?: string;
  icon?: string;
}

interface IBaseMetricGridProps {
  items: IBaseMetricGridItem[];
  variant?: "compact" | "hero" | "summary";
  columns?: "auto" | "two" | "three" | "four";
  pending?: boolean;
}

const {
  items,
  variant = "summary",
  columns = "auto",
  pending = false,
} = defineProps<IBaseMetricGridProps>();

const columnClasses = {
  auto: "",
  two: "grid-cols-2",
  three: "grid-cols-3",
  four: "grid-cols-2 lg:grid-cols-4",
} satisfies Record<NonNullable<IBaseMetricGridProps["columns"]>, string>;

const gridClass = computed(() => {
  return ["grid gap-2.5", columnClasses[columns]].filter(Boolean).join(" ");
});

const itemUi = computed(() => {
  if (variant === "hero") {
    return {
      root: "app-radius-surface border border-default bg-default/70",
      body: "p-3 sm:p-4",
    };
  }

  if (variant === "compact") {
    return {
      root: "app-radius-surface border border-default bg-default/55",
      body: "px-2 py-2",
    };
  }

  return {
    root: "app-radius-surface border border-default bg-default/65",
    body: "px-3 py-2.5",
  };
});

const itemClass = computed(() => {
  return variant === "compact" ? "text-center" : "";
});
</script>

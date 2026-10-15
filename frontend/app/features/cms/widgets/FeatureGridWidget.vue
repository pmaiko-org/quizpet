<template>
  <section
    :id="anchor ?? undefined"
    class="scroll-mt-24"
    :class="sectionClass"
  >
    <UContainer>
      <div class="mx-auto max-w-3xl text-center">
        <p
          v-if="eyebrow"
          class="text-sm font-semibold tracking-[0.24em] text-primary uppercase"
        >
          {{ eyebrow }}
        </p>
        <h2
          class="
            mt-3 text-3xl font-semibold tracking-tight text-balance
            text-highlighted
            sm:text-4xl
          "
        >
          {{ title }}
        </h2>
        <p
          v-if="summary"
          class="
            mt-4 text-base/7 text-toned
            sm:text-lg/8
          "
        >
          {{ summary }}
        </p>
      </div>

      <ol
        class="
          mt-10 grid gap-4
          md:grid-cols-3
        "
        :class="{ 'counter-reset-list': variant === 'steps' }"
      >
        <li
          v-for="(item, index) in items"
          :key="`${item.title}:${index}`"
          class="
            group relative min-h-64 overflow-hidden rounded-3xl border
            border-default bg-elevated p-7 shadow-sm transition duration-300
            hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg
          "
        >
          <span
            class="
              flex size-14 items-center justify-center rounded-2xl bg-primary/10
              text-primary transition-colors
              group-hover:bg-primary group-hover:text-inverted
            "
          >
            <span
              v-if="variant === 'steps'"
              class="text-sm font-semibold tabular-nums"
            >
              {{ String(index + 1).padStart(2, "0") }}
            </span>
            <UIcon
              v-else
              :name="item.icon"
              class="size-6"
            />
          </span>
          <h3 class="mt-6 text-xl font-semibold text-highlighted">
            {{ item.title }}
          </h3>
          <p class="mt-3 text-sm/6 text-toned">
            {{ item.description }}
          </p>
          <UIcon
            v-if="variant === 'cards'"
            :name="item.icon"
            class="
              absolute -right-6 -bottom-7 size-28 text-primary/5
              transition-transform duration-300
              group-hover:-translate-2
            "
            aria-hidden="true"
          />
        </li>
      </ol>
    </UContainer>
  </section>
</template>

<script setup lang="ts">
interface IFeatureItem {
  id?: number;
  title: string;
  description: string;
  icon: string;
}

const { eyebrow, title, summary, anchor, items, variant, tone } = defineProps<{
  eyebrow?: string | null;
  title: string;
  summary?: string | null;
  anchor?: string | null;
  items: IFeatureItem[];
  variant: "cards" | "steps";
  tone: "default" | "tinted";
}>();

const sectionClass = computed(() =>
  tone === "tinted" ? "border-y border-default bg-muted/55 py-16 sm:py-20" : "",
);
</script>

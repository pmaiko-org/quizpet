<template>
  <section class="overflow-hidden">
    <UContainer>
      <div
        class="
          grid items-center gap-10
          lg:grid-cols-12 lg:gap-16
        "
        :class="{
          '[&>*:first-child]:lg:order-2': orientation === 'image-right',
        }"
      >
        <div
          class="
            relative
            lg:col-span-7
          "
        >
          <div
            class="absolute -inset-5 -z-10 rounded-[2.5rem] opacity-70 blur-2xl"
            :class="accentGlowClass"
          />
          <div
            class="
              relative aspect-4/3 overflow-hidden rounded-4xl border
              border-white/15 bg-muted shadow-2xl shadow-black/15
            "
          >
            <NuxtImg
              :src="imageUrl"
              :alt="imageAlt"
              class="
                size-full object-cover transition duration-700
                hover:scale-[1.025]
              "
              sizes="100vw lg:58vw"
              loading="lazy"
            />
            <div
              class="
                absolute inset-0 bg-linear-to-t from-slate-950/35
                via-transparent to-white/5
              "
            />
            <div
              class="
                absolute right-5 bottom-5 flex items-center gap-2 rounded-full
                border border-white/20 bg-slate-950/65 px-4 py-2 text-xs
                font-semibold tracking-[0.16em] text-white uppercase
                backdrop-blur-xl
              "
            >
              <span
                class="size-2 rounded-full"
                :class="accentDotClass"
              />
              QuizPet
            </div>
          </div>
        </div>

        <div class="lg:col-span-5">
          <p
            v-if="eyebrow"
            class="
              text-sm font-semibold tracking-[0.24em] text-primary uppercase
            "
          >
            {{ eyebrow }}
          </p>
          <h2
            class="
              mt-4 text-4xl font-semibold tracking-[-0.035em] text-balance
              text-highlighted
              sm:text-5xl
            "
          >
            {{ title }}
          </h2>
          <p class="mt-6 text-lg/8 text-pretty text-toned">
            {{ summary }}
          </p>
          <UButton
            v-if="primaryLink"
            :to="primaryLink.path"
            :target="primaryLink.isExternal ? '_blank' : undefined"
            :rel="primaryLink.isExternal ? 'noopener noreferrer' : undefined"
            :icon="primaryLink.icon ?? 'i-lucide-arrow-up-right'"
            size="xl"
            variant="soft"
            class="mt-8"
          >
            {{ primaryLink.label }}
          </UButton>
        </div>
      </div>
    </UContainer>
  </section>
</template>

<script setup lang="ts">
import type { TCmsLink } from "~/core/cms/types";

const {
  eyebrow,
  title,
  summary,
  imageUrl,
  imageAlt,
  orientation,
  accent,
  primaryLink,
} = defineProps<{
  eyebrow?: string | null;
  title: string;
  summary: string;
  imageUrl: string;
  imageAlt: string;
  orientation: "image-left" | "image-right";
  accent: "blue" | "amber" | "green";
  primaryLink?: TCmsLink | null;
}>();

const accentGlowClass = computed(
  () =>
    ({
      blue: "bg-blue-500/25",
      amber: "bg-amber-400/25",
      green: "bg-emerald-500/20",
    })[accent],
);
const accentDotClass = computed(
  () =>
    ({
      blue: "bg-blue-400",
      amber: "bg-amber-300",
      green: "bg-emerald-400",
    })[accent],
);
</script>

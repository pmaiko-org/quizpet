<template>
  <section
    class="
      relative isolate flex min-h-svh items-end overflow-hidden bg-slate-950
    "
  >
    <NuxtImg
      :src="imageUrl"
      :alt="imageAlt"
      class="absolute inset-0 -z-20 size-full object-cover"
      sizes="100vw"
      preload
    />
    <div
      class="
        absolute inset-0 -z-10 bg-linear-to-r from-slate-950 via-slate-950/75
        to-slate-950/15
      "
    />
    <div
      class="
        absolute inset-0 -z-10 bg-linear-to-t from-slate-950/80 via-transparent
        to-slate-950/15
      "
    />

    <UContainer
      class="
        w-full pt-36 pb-16
        sm:pt-40 sm:pb-20
        lg:pt-44 lg:pb-24
      "
    >
      <div class="max-w-3xl text-white">
        <p
          v-if="eyebrow"
          class="
            text-sm font-semibold tracking-[0.28em] text-amber-300 uppercase
          "
        >
          {{ eyebrow }}
        </p>
        <h1
          class="
            mt-4 text-5xl/tight font-semibold tracking-[-0.055em] text-balance
            sm:text-6xl/tight
            lg:text-8xl/none
          "
        >
          {{ title }}
        </h1>
        <p
          class="
            mt-6 max-w-2xl text-lg/8 text-white/78
            sm:text-xl/8
          "
        >
          {{ summary }}
        </p>
        <div
          v-if="primaryLink || secondaryLink"
          class="
            mt-9 flex flex-col gap-3
            sm:flex-row
          "
        >
          <UButton
            v-if="primaryLink"
            :to="primaryLink.path"
            :target="primaryLink.isExternal ? '_blank' : undefined"
            :rel="primaryLink.isExternal ? 'noopener noreferrer' : undefined"
            :icon="primaryLink.icon ?? undefined"
            size="xl"
            class="justify-center"
          >
            {{ primaryLink.label }}
          </UButton>
          <UButton
            v-if="secondaryLink"
            :to="secondaryLink.path"
            :target="secondaryLink.isExternal ? '_blank' : undefined"
            :rel="secondaryLink.isExternal ? 'noopener noreferrer' : undefined"
            :icon="secondaryLink.icon ?? undefined"
            size="xl"
            color="neutral"
            variant="soft"
            class="
              justify-center bg-white/12 text-white ring-1 ring-white/20
              hover:bg-white/18
            "
          >
            {{ secondaryLink.label }}
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
  primaryLink,
  secondaryLink,
} = defineProps<{
  eyebrow?: string | null;
  title: string;
  summary: string;
  imageUrl: string;
  imageAlt: string;
  primaryLink?: TCmsLink | null;
  secondaryLink?: TCmsLink | null;
}>();
</script>

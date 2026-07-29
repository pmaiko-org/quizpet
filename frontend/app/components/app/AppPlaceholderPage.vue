<template>
  <div class="space-y-5">
    <AppHeroSection
      :eyebrow="eyebrow"
      :title="title"
      :description="description"
    >
      <div
        class="
          flex flex-col gap-2
          sm:flex-row
        "
      >
        <UButton
          :to="primaryTo"
          :icon="primaryIcon"
          size="lg"
          class="justify-center"
        >
          {{ primaryLabel }}
        </UButton>

        <UButton
          v-if="secondaryTo && secondaryLabel"
          :to="secondaryTo"
          icon="i-lucide-arrow-left"
          variant="outline"
          color="neutral"
          size="lg"
          class="justify-center"
        >
          {{ secondaryLabel }}
        </UButton>
      </div>
    </AppHeroSection>

    <slot />
  </div>
</template>

<script setup lang="ts">
interface IAppPlaceholderPageProps {
  eyebrow: string;
  title: string;
  description: string;
  primaryTo: string;
  primaryLabel: string;
  primaryIcon?: string;
  secondaryTo?: string;
  secondaryLabel?: string;
}

const {
  eyebrow,
  title,
  description,
  primaryTo,
  primaryLabel,
  primaryIcon = "i-lucide-arrow-right",
  secondaryTo = "",
  secondaryLabel = "",
} = defineProps<IAppPlaceholderPageProps>();
</script>

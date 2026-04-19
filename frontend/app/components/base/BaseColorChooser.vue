<template>
  <UFormField
    :label="label"
    :name="name"
    :description="description"
    :hint="hint"
    :required="required"
    :error="error"
    size="xl"
  >
    <div class="space-y-3">
      <div class="flex flex-wrap items-center gap-2">
        <UPopover>
          <UButton
            color="neutral"
            variant="outline"
            size="xl"
            class="min-w-52 justify-between"
          >
            <template #leading>
              <span
                class="size-4 rounded-full border border-default"
                :style="chipStyle"
              />
            </template>

            {{ modelValue || "Оберіть колір" }}
          </UButton>

          <template #content>
            <div class="w-[18rem] space-y-3 p-3">
              <UColorPicker
                v-model="draftColor"
                class="w-full"
              />

              <div class="flex items-center gap-2">
                <UInput
                  v-model="draftColor"
                  size="lg"
                  class="flex-1"
                  placeholder="#000000"
                />

                <UButton
                  color="primary"
                  variant="soft"
                  @click="applyDraftColor"
                >
                  Застосувати
                </UButton>
              </div>
            </div>
          </template>
        </UPopover>

        <UButton
          v-if="modelValue"
          color="neutral"
          variant="ghost"
          size="xl"
          icon="i-lucide-eraser"
          @click="clearColor"
        >
          Очистити
        </UButton>
      </div>

      <div
        class="
          grid grid-cols-5 gap-2
          sm:grid-cols-10
        "
      >
        <button
          v-for="preset in normalizedPresets"
          :key="preset"
          type="button"
          class="
            group relative h-10 rounded-xl border border-default
            transition-transform
            hover:-translate-y-0.5
            focus:outline-none
            focus-visible:ring-2 focus-visible:ring-primary
          "
          :class="modelValue === preset ? 'ring-2 ring-primary' : ''"
          :style="{ backgroundColor: preset }"
          :aria-label="`Обрати колір ${preset}`"
          @click="modelValue = preset"
        >
          <span class="sr-only">{{ preset }}</span>
          <UIcon
            v-if="modelValue === preset"
            name="i-lucide-check"
            class="absolute inset-0 m-auto size-4 text-white drop-shadow-sm"
          />
        </button>
      </div>
    </div>
  </UFormField>
</template>

<script setup lang="ts">
const DEFAULT_PRESETS = [
  "#111827",
  "#334155",
  "#64748B",
  "#E2E8F0",
  "#FFFFFF",
  "#F97316",
  "#E11D48",
  "#DC2626",
  "#16A34A",
  "#2563EB",
];

const props = defineProps<{
  label?: string;
  name?: string;
  description?: string;
  hint?: string;
  error?: string | boolean;
  required?: boolean;
  presets?: string[];
}>();

const modelValue = defineModel<string | undefined>({
  required: true,
});

const draftColor = ref(modelValue.value || DEFAULT_PRESETS[0]);

watch(
  () => modelValue.value,
  (value) => {
    draftColor.value = value || DEFAULT_PRESETS[0];
  },
  { immediate: true },
);

const normalizedPresets = computed(() => {
  return [...new Set(props.presets?.length ? props.presets : DEFAULT_PRESETS)];
});

const chipStyle = computed(() => {
  return {
    backgroundColor: modelValue.value || "#ffffff",
  };
});

const applyDraftColor = () => {
  if (!draftColor.value) {
    modelValue.value = undefined;
    return;
  }

  modelValue.value = draftColor.value;
};

const clearColor = () => {
  modelValue.value = undefined;
};
</script>

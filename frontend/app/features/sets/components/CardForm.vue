<template>
  <article
    class="
      rounded-md border border-default bg-elevated/96 p-4 shadow-sm
      sm:p-5
    "
  >
    <div class="mb-4 flex items-center justify-between gap-3">
      <div class="flex items-center gap-3">
        <span
          class="
            flex size-8 items-center justify-center rounded-sm bg-primary/10
            text-sm font-bold text-primary
          "
        >
          {{ index + 1 }}
        </span>
        <div>
          <p class="text-sm font-semibold text-highlighted">
            Картка {{ index + 1 }}
          </p>
          <p class="text-xs text-muted">
            Термін і правильна відповідь
          </p>
        </div>
      </div>

      <div class="flex items-center gap-1">
        <UButton
          type="button"
          color="neutral"
          variant="ghost"
          size="sm"
          icon="i-lucide-arrow-up"
          :disabled="isFirst"
          aria-label="Перемістити картку вище"
          @click="$emit('moveUp')"
        />
        <UButton
          type="button"
          color="neutral"
          variant="ghost"
          size="sm"
          icon="i-lucide-arrow-down"
          :disabled="isLast"
          aria-label="Перемістити картку нижче"
          @click="$emit('moveDown')"
        />
        <UButton
          v-if="canRemove"
          type="button"
          color="error"
          variant="ghost"
          size="sm"
          icon="i-lucide-trash-2"
          aria-label="Видалити картку"
          @click="$emit('remove')"
        />
      </div>
    </div>

    <div
      class="
        grid gap-4
        md:grid-cols-2
      "
    >
      <UFormField
        :name="fieldName('term')"
        label="Термін"
        description="Слово, поняття або питання."
        required
        size="lg"
      >
        <UInput
          v-model="modelValue.term"
          size="lg"
          class="w-full"
          placeholder="Наприклад, Photosynthesis"
        />
      </UFormField>

      <UFormField
        :name="fieldName('termDescription')"
        label="Підказка"
        description="Коротке уточнення до терміна."
        size="lg"
      >
        <UInput
          v-model="modelValue.termDescription"
          size="lg"
          class="w-full"
          placeholder="Необов’язковий контекст"
        />
      </UFormField>

      <UFormField
        :name="fieldName('definition')"
        label="Визначення"
        description="Пояснення, переклад або правильна відповідь."
        required
        size="lg"
        class="col-span-full"
      >
        <UTextarea
          v-model="modelValue.definition"
          size="lg"
          autoresize
          :rows="2"
          class="w-full"
          placeholder="Дайте коротку й точну відповідь"
        />
      </UFormField>
    </div>

    <details
      class="
        group mt-4 overflow-hidden rounded-md border border-default bg-muted/35
      "
    >
      <summary
        class="
          flex cursor-pointer list-none items-center justify-between gap-3 px-3
          py-2.5 text-sm font-medium text-toned
          hover:text-highlighted
        "
      >
        <span class="flex items-center gap-2">
          <UIcon
            name="i-lucide-palette"
            class="size-4 text-primary"
          />
          Зображення та оформлення
        </span>
        <UIcon
          name="i-lucide-chevron-down"
          class="
            size-4 text-muted transition-transform
            group-open:rotate-180
          "
        />
      </summary>

      <div
        class="
          grid gap-4 border-t border-default p-4
          lg:grid-cols-2
        "
      >
        <BaseFilePicker
          v-model="modelValue.termImage"
          :name="fieldName('termImage')"
          label="Зображення терміна"
          description="Необов’язкова візуальна підказка."
        />

        <BaseFilePicker
          v-model="modelValue.definitionImage"
          :name="fieldName('definitionImage')"
          label="Зображення відповіді"
          description="Окрема ілюстрація для визначення."
        />

        <BaseColorChooser
          v-model="modelValue.textColor"
          :name="fieldName('textColor')"
          label="Колір тексту"
          description="Залиште порожнім для кольору теми."
        />

        <BaseColorChooser
          v-model="modelValue.backgroundColor"
          :name="fieldName('backgroundColor')"
          label="Колір фону"
          description="Залиште порожнім для стандартної поверхні."
        />
      </div>
    </details>
  </article>
</template>

<script setup lang="ts">
import type { TCardFormData } from "../types";

const {
  index,
  canRemove = false,
  isFirst = false,
  isLast = false,
} = defineProps<{
  index: number;
  canRemove?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
}>();

defineEmits<{
  remove: [];
  moveUp: [];
  moveDown: [];
}>();

const modelValue = defineModel<TCardFormData>({
  required: true,
});

const fieldName = (field: keyof TCardFormData) => {
  return `cards.${index}.${field}`;
};
</script>

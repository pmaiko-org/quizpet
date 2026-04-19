<template>
  <div
    class="
      rounded-3xl border border-default bg-default/80 p-5 shadow-sm
      sm:p-6
    "
  >
    <div class="mb-5 flex items-start justify-between gap-4">
      <div>
        <p class="text-xs font-medium tracking-[0.24em] text-primary uppercase">
          Картка {{ index + 1 }}
        </p>
        <h3 class="mt-1 text-lg font-semibold text-highlighted">
          Заповніть термін, визначення та оформлення
        </h3>
      </div>

      <UButton
        v-if="canRemove"
        color="error"
        variant="ghost"
        size="sm"
        icon="i-lucide-trash-2"
        @click="$emit('remove')"
      >
        Видалити
      </UButton>
    </div>

    <div class="mb-5 flex flex-wrap gap-2">
      <UButton
        type="button"
        color="neutral"
        variant="outline"
        size="sm"
        icon="i-lucide-arrow-up"
        :disabled="isFirst"
        @click="$emit('moveUp')"
      >
        Вище
      </UButton>

      <UButton
        type="button"
        color="neutral"
        variant="outline"
        size="sm"
        icon="i-lucide-arrow-down"
        :disabled="isLast"
        @click="$emit('moveDown')"
      >
        Нижче
      </UButton>
    </div>

    <div
      class="
        grid gap-5
        xl:grid-cols-2
      "
    >
      <UFormField
        :name="fieldName('term')"
        label="Термін"
        description="Коротке слово, поняття або питання."
        required
        size="xl"
      >
        <UInput
          v-model="modelValue.term"
          size="xl"
          class="w-full"
          placeholder="Наприклад, Photosynthesis"
        />
      </UFormField>

      <UFormField
        :name="fieldName('termDescription')"
        label="Опис терміна"
        description="Коротке пояснення, підказка або уточнення до терміна."
        required
        size="xl"
      >
        <UInput
          v-model="modelValue.termDescription"
          size="xl"
          class="w-full"
          placeholder="Наприклад, Process plants use to convert light into energy"
        />
      </UFormField>

      <UFormField
        :name="fieldName('definition')"
        label="Визначення"
        description="Пояснення, переклад або правильна відповідь."
        required
        size="xl"
        class="col-span-full"
      >
        <UTextarea
          v-model="modelValue.definition"
          size="xl"
          autoresize
          :rows="3"
          class="w-full"
          placeholder="Опишіть значення або дайте відповідь"
        />
      </UFormField>

      <BaseFilePicker
        v-model="modelValue.termImage"
        :name="fieldName('termImage')"
        label="Зображення для терміна"
        description="Додаткове зображення, якщо хочете підсилити асоціацію."
      />

      <BaseFilePicker
        v-model="modelValue.definitionImage"
        :name="fieldName('definitionImage')"
        label="Зображення для визначення"
        description="Можна використати окрему ілюстрацію для відповіді."
      />

      <BaseColorChooser
        v-model="modelValue.textColor"
        :name="fieldName('textColor')"
        label="Колір тексту"
        description="Впливає на читабельність та контраст."
      />

      <BaseColorChooser
        v-model="modelValue.backgroundColor"
        :name="fieldName('backgroundColor')"
        label="Колір фону"
        description="Фон картки краще робити м’яким, щоб текст залишався помітним."
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ICardFormData } from "~/pages/cards/components/types";

const { index } = defineProps<{
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

const modelValue = defineModel<ICardFormData>({
  required: true,
});

const fieldName = (field: keyof ICardFormData) => {
  return `cards.${index}.${field}`;
};
</script>

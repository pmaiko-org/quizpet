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
      <button
        type="button"
        class="w-full overflow-hidden rounded-2xl border border-default bg-default text-left transition hover:border-primary/60 hover:bg-elevated/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        @click="isOpen = true"
      >
        <div class="flex aspect-[16/9] items-center justify-center bg-muted/50">
          <img
            v-if="currentPreview"
            :src="currentPreview"
            alt="Preview"
            class="h-full w-full object-cover"
          />

          <div
            v-else
            class="flex flex-col items-center gap-2 px-4 text-center text-sm text-toned"
          >
            <UIcon
              name="i-lucide-image-plus"
              class="size-8"
            />
            <span>Натисніть, щоб вибрати або завантажити зображення</span>
          </div>
        </div>

        <div class="flex items-center justify-between gap-3 border-t border-default px-4 py-3">
          <p class="truncate text-sm text-highlighted">
            {{ modelValue || "Зображення не вибране" }}
          </p>

          <div class="inline-flex items-center gap-2 text-xs text-toned">
            <UIcon
              name="i-lucide-pencil"
              class="size-4"
            />
            <span>Змінити</span>
          </div>
        </div>
      </button>

      <div
        v-if="modelValue"
        class="flex justify-end"
      >
        <UButton
          color="neutral"
          variant="ghost"
          size="sm"
          icon="i-lucide-x"
          @click="clearImage"
        >
          Очистити
        </UButton>
      </div>

      <p
        v-if="requestError"
        class="text-sm text-error"
      >
        {{ requestError }}
      </p>
    </div>

    <UModal
      v-model:open="isOpen"
      title="Вибір зображення"
      description="Тут можна завантажити новий файл або вибрати вже існуюче зображення."
      :ui="{ content: 'sm:max-w-4xl' }"
    >
      <template #body>
        <div class="space-y-4">
          <div class="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
            <div class="rounded-2xl border border-default bg-default/80 p-4">
              <div class="mb-3 flex items-start justify-between gap-3">
                <div>
                  <p class="text-sm font-medium text-highlighted">Завантаження</p>
                  <p class="text-xs text-toned">
                    Після вибору файл одразу відправляється на сервер.
                  </p>
                </div>

                <UBadge
                  v-if="isUploading"
                  color="primary"
                  variant="soft"
                >
                  Завантаження...
                </UBadge>
              </div>

              <UFileUpload
                v-model="selectedFile"
                accept="image/*"
                :preview="false"
                variant="area"
                size="lg"
                class="w-full"
                label="Натисніть або перетягніть зображення"
                description="PNG, JPG, WEBP, SVG"
                :disabled="isUploading"
              />
            </div>

            <div class="rounded-2xl border border-default bg-default/80 p-4">
              <div class="mb-3 flex items-start justify-between gap-3">
                <div>
                  <p class="text-sm font-medium text-highlighted">Бібліотека</p>
                  <p class="text-xs text-toned">
                    Список оновлюється після відкриття модалки та після завантаження.
                  </p>
                </div>

                <UButton
                  color="neutral"
                  variant="ghost"
                  size="sm"
                  icon="i-lucide-refresh-cw"
                  :loading="isLoading"
                  @click="loadImages"
                >
                  Оновити
                </UButton>
              </div>

              <USelectMenu
                v-model="selectedLibraryValue"
                :items="normalizedItems"
                :disabled="!normalizedItems.length || isLoading"
                value-key="value"
                label-key="label"
                :search-input="{ placeholder: 'Пошук зображення' }"
                :placeholder="
                  normalizedItems.length
                    ? 'Оберіть зображення'
                    : 'Список зображень порожній'
                "
                clear
                size="xl"
                class="w-full"
              />
            </div>
          </div>

          <div class="overflow-hidden rounded-2xl border border-default bg-elevated/70">
            <div class="flex aspect-[16/9] items-center justify-center bg-muted/50">
              <img
                v-if="currentPreview"
                :src="currentPreview"
                alt="Preview"
                class="h-full w-full object-cover"
              />

              <div
                v-else
                class="flex flex-col items-center gap-2 text-center text-sm text-toned"
              >
                <UIcon
                  name="i-lucide-image"
                  class="size-8"
                />
                <span>Попередній перегляд з’явиться тут</span>
              </div>
            </div>

            <div class="border-t border-default px-4 py-3">
              <p class="truncate text-sm text-highlighted">
                {{ modelValue || "Шлях до зображення ще не вибраний" }}
              </p>
            </div>
          </div>
        </div>
      </template>
    </UModal>
  </UFormField>
</template>

<script setup lang="ts">
interface ImageItem {
  label?: string;
  value: string;
  preview?: string;
}

const props = withDefaults(defineProps<{
  label?: string;
  name?: string;
  description?: string;
  hint?: string;
  error?: string | boolean;
  required?: boolean;
  items?: Array<string | ImageItem>;
}>(), {
  label: "Зображення",
  items: () => [],
});

const modelValue = defineModel<string | undefined>({
  required: true,
});

const isOpen = ref(false);
const isLoading = ref(false);
const isUploading = ref(false);
const requestError = ref<string>();
const selectedFile = ref<File | null>(null);
const remoteItems = ref<ImageItem[]>([]);

const normalizedItems = computed<ImageItem[]>(() => {
  const mergedItems = [...props.items, ...remoteItems.value];

  return mergedItems.map((item) => {
    if (typeof item === "string") {
      return {
        label: item.split("/").filter(Boolean).pop() || item,
        value: item,
        preview: item,
      };
    }

    return {
      ...item,
      label: item.label || item.value.split("/").filter(Boolean).pop() || item.value,
      preview: item.preview || item.value,
    };
  }).filter((item, index, items) => {
    return items.findIndex(({ value }) => value === item.value) === index;
  });
});

const selectedLibraryValue = computed<string | undefined>({
  get: () => {
    const selected = normalizedItems.value.find((item) => item.value === modelValue.value);
    return selected?.value;
  },
  set: (value) => {
    setImageValue(value || undefined);
  },
});

const currentPreview = computed(() => {
  if (!modelValue.value) {
    return undefined;
  }

  const selected = normalizedItems.value.find((item) => item.value === modelValue.value);

  return selected?.preview || modelValue.value;
});

const loadImages = async () => {
  try {
    isLoading.value = true;
    requestError.value = undefined;
    remoteItems.value = await $fetch<ImageItem[]>("/backend/cards/images");
  } catch {
    requestError.value = "Не вдалося завантажити список зображень.";
  } finally {
    isLoading.value = false;
  }
};

const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    isUploading.value = true;
    requestError.value = undefined;

    const response = await $fetch<{ path: string }>("/backend/cards/images", {
      method: "POST",
      body: formData,
    });

    modelValue.value = response.path;
    await loadImages();
  } catch {
    requestError.value = "Не вдалося завантажити файл на сервер.";
  } finally {
    isUploading.value = false;
    selectedFile.value = null;
  }
};

watch(selectedFile, async (file) => {
  if (!file) {
    return;
  }

  await uploadFile(file);
});

watch(isOpen, async (value) => {
  if (!value) {
    return;
  }

  await loadImages();
});

const clearImage = () => {
  modelValue.value = undefined;
};
</script>

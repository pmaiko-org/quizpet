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
            :src="currentPreview.src"
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

        <div
          class="flex items-center justify-between gap-3 border-t border-default px-4 py-3"
        >
          <p class="truncate text-sm text-highlighted">
            {{ modelValue?.name || "Зображення не вибране" }}
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
      :ui="{ content: 'sm:max-w-6xl' }"
    >
      <template #body>
        <div class="space-y-4">
          <div
            class="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(20rem,0.85fr)]"
          >
            <div class="space-y-4">
              <div class="rounded-2xl border border-default bg-default/80 p-4">
                <div class="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <p class="text-sm font-medium text-highlighted">
                      Завантаження
                    </p>
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
                <div class="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <p class="text-sm font-medium text-highlighted">
                      Бібліотека
                    </p>
                    <p class="text-xs text-toned">
                      Клік по картці вибирає файл. Видалення прибирає його з
                      бібліотеки.
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

                <div
                  v-if="isLoading"
                  class="grid gap-3 sm:grid-cols-2 xl:grid-cols-3"
                >
                  <div
                    v-for="index in 6"
                    :key="index"
                    class="overflow-hidden rounded-2xl border border-default bg-default/70"
                  >
                    <div class="aspect-square animate-pulse bg-muted/60" />
                    <div class="space-y-2 p-3">
                      <div class="h-4 rounded-full bg-muted/60" />
                      <div class="h-4 w-2/3 rounded-full bg-muted/60" />
                    </div>
                  </div>
                </div>

                <div
                  v-else-if="!remoteItems.length"
                  class="rounded-2xl border border-dashed border-default bg-muted/20 px-4 py-10 text-center"
                >
                  <div
                    class="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary"
                  >
                    <UIcon
                      name="i-lucide-images"
                      class="size-6"
                    />
                  </div>
                  <p class="mt-4 text-sm font-medium text-highlighted">
                    Бібліотека порожня
                  </p>
                  <p class="mt-2 text-xs leading-5 text-toned">
                    Завантажте перше зображення, і воно одразу з’явиться тут.
                  </p>
                </div>

                <div
                  v-else
                  class="grid gap-3 sm:grid-cols-2 xl:grid-cols-3"
                >
                  <article
                    v-for="item in remoteItems"
                    :key="item.id"
                    class="overflow-hidden rounded-2xl border bg-default/70 transition"
                    :class="itemCardClass(item)"
                  >
                    <button
                      type="button"
                      class="block w-full text-left"
                      @click="setImageValue(item)"
                    >
                      <div
                        class="relative aspect-square overflow-hidden bg-muted/50"
                      >
                        <img
                          :src="item.src"
                          :alt="item.name"
                          class="h-full w-full object-cover transition duration-200 hover:scale-[1.02]"
                        />

                        <div class="absolute left-3 top-3">
                          <UBadge
                            v-if="isSelected(item)"
                            color="primary"
                            variant="solid"
                          >
                            Вибрано
                          </UBadge>
                        </div>
                      </div>

                      <div class="space-y-3 p-3">
                        <div>
                          <p
                            class="line-clamp-1 text-sm font-medium text-highlighted"
                          >
                            {{ item.name }}
                          </p>
                          <p class="line-clamp-1 text-xs text-toned">
                            {{ item.src }}
                          </p>
                        </div>
                      </div>
                    </button>

                    <div
                      class="flex items-center justify-between gap-2 border-t border-default px-3 py-3"
                    >
                      <UButton
                        size="sm"
                        :variant="isSelected(item) ? 'solid' : 'outline'"
                        color="primary"
                        icon="i-lucide-check"
                        @click="setImageValue(item)"
                      >
                        Обрати
                      </UButton>

                      <UButton
                        size="sm"
                        color="error"
                        variant="ghost"
                        icon="i-lucide-trash-2"
                        :loading="deletingFileId === item.id"
                        class="cursor-pointer"
                        @click="handleDeleteFile(item)"
                      />
                    </div>
                  </article>
                </div>
              </div>
            </div>

            <div
              class="overflow-hidden rounded-2xl border border-default bg-elevated/70"
            >
              <div
                class="flex aspect-[4/3] items-center justify-center bg-muted/50"
              >
                <img
                  v-if="currentPreview"
                  :src="currentPreview.src"
                  alt="Preview"
                  class="h-full w-full object-cover"
                />

                <div
                  v-else
                  class="flex flex-col items-center gap-2 px-4 text-center text-sm text-toned"
                >
                  <UIcon
                    name="i-lucide-image"
                    class="size-8"
                  />
                  <span>Попередній перегляд з’явиться тут</span>
                </div>
              </div>

              <div class="space-y-4 border-t border-default px-4 py-4">
                <div>
                  <p
                    class="text-xs font-medium uppercase tracking-[0.2em] text-primary"
                  >
                    Активний файл
                  </p>
                  <p class="mt-2 text-base font-semibold text-highlighted">
                    {{ currentPreview?.name || "Файл ще не вибраний" }}
                  </p>
                  <p class="mt-1 break-all text-xs leading-5 text-toned">
                    {{
                      currentPreview?.src ||
                      "Після вибору тут з’явиться шлях до файлу."
                    }}
                  </p>
                </div>

                <div
                  v-if="currentPreview"
                  class="rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-toned"
                >
                  Це зображення буде використане для поточного поля форми.
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </UModal>
  </UFormField>
</template>

<script setup lang="ts">
import type { IFileResponse } from "~/repository/storage-files";

defineProps<{
  label?: string;
  name?: string;
  description?: string;
  hint?: string;
  error?: string | boolean;
  required?: boolean;
}>();

const modelValue = defineModel<IFileResponse | undefined>({
  required: true,
});

const { $repository } = useNuxtApp();

const isOpen = ref(false);
const isLoading = ref(false);
const isUploading = ref(false);
const requestError = ref<string>();
const selectedFile = ref<File | null>(null);
const remoteItems = ref<IFileResponse[]>([]);
const deletingFileId = ref<string | null>(null);

const setImageValue = (value: IFileResponse | undefined) => {
  modelValue.value = value;
};

const currentPreview = computed(() => modelValue.value);

const isSelected = (item: IFileResponse) => {
  return modelValue.value?.id === item.id;
};

const itemCardClass = (item: IFileResponse) => {
  return isSelected(item)
    ? "border-primary bg-primary/5 shadow-sm"
    : "border-default hover:border-primary/40 hover:bg-elevated/70";
};

const loadImages = async () => {
  try {
    isLoading.value = true;
    requestError.value = undefined;
    remoteItems.value = await $repository.storageFiles.getFiles();
  } catch {
    requestError.value = "Не вдалося завантажити список зображень.";
  } finally {
    isLoading.value = false;
  }
};

const uploadFile = async (file: File) => {
  try {
    isUploading.value = true;
    requestError.value = undefined;

    const response = await $repository.storageFiles.upload(file);
    modelValue.value = response;
    await loadImages();
  } catch {
    requestError.value = "Не вдалося завантажити файл на сервер.";
  } finally {
    isUploading.value = false;
    selectedFile.value = null;
  }
};

const handleDeleteFile = async (item: IFileResponse) => {
  const shouldDelete = window.confirm(
    `Видалити файл "${item.name}" з бібліотеки?`
  );

  if (!shouldDelete) {
    return;
  }

  try {
    deletingFileId.value = item.id;
    requestError.value = undefined;

    await $repository.storageFiles.deleteFile(item.id);

    if (modelValue.value?.id === item.id) {
      modelValue.value = undefined;
    }

    remoteItems.value = remoteItems.value.filter(({ id }) => id !== item.id);
  } catch {
    requestError.value = "Не вдалося видалити файл.";
  } finally {
    deletingFileId.value = null;
  }
};

watch(selectedFile, async file => {
  if (!file) {
    return;
  }

  await uploadFile(file);
});

watch(isOpen, async value => {
  if (!value) {
    return;
  }

  await loadImages();
});

const clearImage = () => {
  modelValue.value = undefined;
};
</script>

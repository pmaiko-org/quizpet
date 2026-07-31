<template>
  <BaseDataBoundary
    :pending="pending"
    :error="error"
    errorTitle="Не вдалося завантажити профіль"
    errorDescription="Спробуйте оновити дані профілю ще раз."
    @retry="refresh"
  >
    <template #loading>
      <ProfileSkeleton />
    </template>

    <div class="space-y-6">
      <UForm
        :schema="profileSchema"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UCard
          :ui="{
            root: 'border border-default bg-elevated/96 shadow-sm rounded-md',
            body: 'p-5 sm:p-6',
          }"
        >
          <div
            class="
              grid gap-5
              lg:grid-cols-[minmax(0,1fr)_minmax(16rem,0.62fr)]
            "
          >
            <div class="space-y-5">
              <BaseSectionIntro
                eyebrow="Профіль"
                title="Ваш профіль"
                description="Оновіть ім’я та аватар, які бачать інші учасники QuizPet."
                titleTag="h1"
                size="hero"
              />

              <div
                class="
                  grid gap-4
                  md:grid-cols-2
                "
              >
                <UFormField
                  label="Ім'я"
                  name="firstName"
                  description="Використовується в профілі та списках користувачів."
                  required
                  size="lg"
                >
                  <UInput
                    v-model="state.firstName"
                    size="lg"
                    class="w-full"
                    placeholder="Наприклад, Петро"
                  />
                </UFormField>

                <UFormField
                  label="Прізвище"
                  name="lastName"
                  description="Допомагає показувати повне ім’я в інтерфейсі."
                  required
                  size="lg"
                >
                  <UInput
                    v-model="state.lastName"
                    size="lg"
                    class="w-full"
                    placeholder="Наприклад, Мельник"
                  />
                </UFormField>
              </div>

              <UFormField
                label="Email"
                name="email"
                description="Поле доступне лише для перегляду, бо авторизація йде через Google."
                size="lg"
              >
                <UInput
                  :modelValue="state.email"
                  size="lg"
                  class="w-full"
                  readonly
                  disabled
                />
              </UFormField>
            </div>

            <UCard
              :ui="{
                root: 'rounded-md border border-muted bg-elevated/72',
                body: 'min-w-0 p-4',
              }"
            >
              <BaseFilePicker
                v-model="state.avatar"
                name="avatar"
                label="Аватар"
                description="Оберіть квадратне або близьке до квадратного зображення для кращого вигляду."
                hint="PNG, JPG, WEBP, SVG"
              />
            </UCard>
          </div>

          <div class="mt-5 flex justify-end border-t border-default pt-4">
            <UButton
              type="submit"
              size="lg"
              :loading="submitting"
              class="
                w-full justify-center
                sm:w-auto sm:min-w-40
              "
            >
              Зберегти профіль
            </UButton>
          </div>
        </UCard>
      </UForm>

      <UCard
        :ui="{
          root: 'rounded-md ring-1 ring-error/30',
          body: 'p-5 sm:p-6',
        }"
      >
        <div
          class="
            flex flex-col gap-4
            sm:flex-row sm:items-center sm:justify-between
          "
        >
          <div class="space-y-1">
            <h2 class="text-base font-semibold text-error">
              Видалення акаунта
            </h2>
            <p class="max-w-xl text-sm text-muted">
              Ця дія незворотна. Буде видалено ваш акаунт, аватар і всі створені
              вами набори карток.
            </p>
          </div>

          <UButton
            color="error"
            variant="soft"
            icon="i-lucide-trash-2"
            class="shrink-0"
            @click="openDeleteModal"
          >
            Видалити акаунт
          </UButton>
        </div>
      </UCard>
    </div>

    <UModal
      v-model:open="deleteModalOpen"
      title="Видалити акаунт?"
      description="Відновити дані буде неможливо."
    >
      <template #body>
        <div class="space-y-4">
          <p class="text-sm text-muted">
            Для підтвердження введіть свій email
            <strong class="text-default">{{ user?.email }}</strong>.
          </p>
          <UFormField label="Підтвердження email">
            <UInput
              v-model="deleteConfirmEmail"
              class="w-full"
              placeholder="Ваш email"
              autocomplete="off"
            />
          </UFormField>
        </div>
      </template>

      <template #footer>
        <div class="flex w-full justify-end gap-3">
          <UButton
            variant="ghost"
            color="neutral"
            :disabled="deleting"
            @click="deleteModalOpen = false"
          >
            Скасувати
          </UButton>
          <UButton
            color="error"
            :loading="deleting"
            :disabled="!canDelete"
            @click="onDeleteAccount"
          >
            Видалити назавжди
          </UButton>
        </div>
      </template>
    </UModal>
  </BaseDataBoundary>
</template>

<script setup lang="ts">
import { RouteName } from "~/constants";
import type { IFileResponse, IUserResponse } from "~/types/api.generated";

import { profileSchema } from "../validation";

interface IProfileFormState {
  firstName: string;
  lastName: string;
  email: string;
  avatar?: IFileResponse;
}

const { $repository } = useNuxtApp();
const { user, pending, error, refresh } = useCurrentUser();
const { clearTokens } = useAuthStore();

const state = reactive<IProfileFormState>({
  firstName: "",
  lastName: "",
  email: "",
  avatar: undefined,
});

const submitting = ref(false);
const toast = useToast();

const deleteModalOpen = ref(false);
const deleteConfirmEmail = ref("");
const deleting = ref(false);

const canDelete = computed(() => {
  const email = user.value?.email?.trim().toLowerCase();
  return !!email && deleteConfirmEmail.value.trim().toLowerCase() === email;
});

const openDeleteModal = () => {
  deleteConfirmEmail.value = "";
  deleteModalOpen.value = true;
};

const onDeleteAccount = async () => {
  if (!canDelete.value) return;

  try {
    deleting.value = true;

    await $repository.profile.deleteAccount({
      confirmEmail: deleteConfirmEmail.value.trim(),
    });

    deleteModalOpen.value = false;
    clearTokens();
    clearNuxtData();

    toast.add({ title: "Акаунт видалено", description: "" });

    await navigateTo({ name: RouteName.LOGIN });
  } catch {
    toast.add({
      title: "Не вдалося видалити акаунт",
      description: "",
      color: "error",
    });
  } finally {
    deleting.value = false;
  }
};

const applyProfile = (value: IUserResponse | null) => {
  state.firstName = value?.firstName ?? "";
  state.lastName = value?.lastName ?? "";
  state.email = value?.email ?? "";
  state.avatar = value?.avatar
    ? {
        id: value.avatarFileId ?? "",
        name: value.avatar.split("/").pop() ?? "avatar",
        src: value.avatar,
      }
    : undefined;
};

watch(user, applyProfile, { immediate: true });

const onSubmit = async (event: {
  data: ReturnType<typeof profileSchema.parse>;
}) => {
  try {
    submitting.value = true;

    const updatedProfile = await $repository.profile.updateProfile({
      firstName: event.data.firstName,
      lastName: event.data.lastName,
      avatarFileId: event.data.avatar?.id || null,
    });

    applyProfile(updatedProfile);
    await refresh();

    toast.add({
      title: "Профіль оновлено",
      description: "",
    });
  } catch {
    toast.add({
      title: "Не вдалося зберегти профіль",
      description: "",
      color: "error",
    });
  } finally {
    submitting.value = false;
  }
};
</script>

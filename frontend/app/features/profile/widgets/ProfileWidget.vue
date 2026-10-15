<template>
  <BaseDataBoundary
    :pending="pending"
    :error="error"
    :errorTitle="$t('profile.loadError.title')"
    :errorDescription="$t('profile.loadError.description')"
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
        @submit="handleSubmit"
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
                :eyebrow="$t('profile.eyebrow')"
                :title="$t('profile.title')"
                :description="$t('profile.description')"
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
                  :label="$t('profile.firstName.label')"
                  name="firstName"
                  :description="$t('profile.firstName.description')"
                  required
                  size="lg"
                >
                  <UInput
                    v-model="state.firstName"
                    size="lg"
                    class="w-full"
                    :placeholder="$t('profile.firstName.placeholder')"
                  />
                </UFormField>

                <UFormField
                  :label="$t('profile.lastName.label')"
                  name="lastName"
                  :description="$t('profile.lastName.description')"
                  required
                  size="lg"
                >
                  <UInput
                    v-model="state.lastName"
                    size="lg"
                    class="w-full"
                    :placeholder="$t('profile.lastName.placeholder')"
                  />
                </UFormField>
              </div>

              <UFormField
                label="Email"
                name="email"
                :description="$t('profile.email.description')"
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
                :label="$t('profile.avatar.label')"
                :description="$t('profile.avatar.description')"
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
              {{ $t("profile.save") }}
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
              {{ $t("profile.delete.sectionTitle") }}
            </h2>
            <p class="max-w-xl text-sm text-muted">
              {{ $t("profile.delete.sectionDescription") }}
            </p>
          </div>

          <UButton
            color="error"
            variant="soft"
            icon="i-lucide-trash-2"
            class="shrink-0"
            @click="handleOpenDeleteModal"
          >
            {{ $t("profile.delete.action") }}
          </UButton>
        </div>
      </UCard>
    </div>

    <UModal
      v-model:open="deleteModalOpen"
      :title="$t('profile.delete.modalTitle')"
      :description="$t('profile.delete.modalDescription')"
    >
      <template #body>
        <div class="space-y-4">
          <p class="text-sm text-muted">
            {{ $t("profile.delete.confirmPrompt") }}
            <strong class="text-default">{{ user?.email }}</strong>.
          </p>
          <UFormField :label="$t('profile.delete.confirmLabel')">
            <UInput
              v-model="deleteConfirmEmail"
              class="w-full"
              :placeholder="$t('profile.delete.confirmPlaceholder')"
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
            @click="handleCloseDeleteModal"
          >
            {{ $t("common.cancel") }}
          </UButton>
          <UButton
            color="error"
            :loading="deleting"
            :disabled="!canDelete"
            @click="handleDeleteAccount"
          >
            {{ $t("profile.delete.forever") }}
          </UButton>
        </div>
      </template>
    </UModal>
  </BaseDataBoundary>
</template>

<script setup lang="ts">
import type {
  IFileResponse,
  IUserResponse,
} from "~/shared/types/api.generated";

import { createProfileSchema } from "../validation";

interface IProfileFormState {
  firstName: string;
  lastName: string;
  email: string;
  avatar?: IFileResponse;
}

const { $repository } = useNuxtApp();
const { t } = useI18n();
const profileSchema = createProfileSchema(t);
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
const routes = usePageRoutes();

const deleteModalOpen = ref(false);
const deleteConfirmEmail = ref("");
const deleting = ref(false);

const canDelete = computed(() => {
  const email = user.value?.email?.trim().toLowerCase();
  return !!email && deleteConfirmEmail.value.trim().toLowerCase() === email;
});

const handleOpenDeleteModal = () => {
  deleteConfirmEmail.value = "";
  deleteModalOpen.value = true;
};

const handleCloseDeleteModal = () => {
  deleteModalOpen.value = false;
};

const handleDeleteAccount = async () => {
  if (!canDelete.value) return;

  try {
    deleting.value = true;

    await $repository.profile.deleteAccount({
      confirmEmail: deleteConfirmEmail.value.trim(),
    });

    deleteModalOpen.value = false;
    clearTokens();
    clearNuxtData();

    toast.add({ title: t("profile.toast.deleted"), description: "" });

    await navigateTo(routes.resolve("login"));
  } catch {
    toast.add({
      title: t("profile.toast.deleteError"),
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

const handleSubmit = async (event: {
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
      title: t("profile.toast.updated"),
      description: "",
    });
  } catch {
    toast.add({
      title: t("profile.toast.updateError"),
      description: "",
      color: "error",
    });
  } finally {
    submitting.value = false;
  }
};
</script>

<template>
  <UForm
    :schema="profileSchema"
    :state="state"
    class="space-y-8"
    @submit="onSubmit"
  >
    <section
      class="
        rounded-4xl border border-default bg-default/85 p-6 shadow-sm
        sm:p-8
      "
    >
      <div
        class="
          grid gap-6
          xl:grid-cols-[minmax(0,1fr)_minmax(18rem,0.8fr)]
        "
      >
        <div class="space-y-6">
          <div class="space-y-2">
            <p
              class="
                text-sm font-medium tracking-[0.24em] text-primary uppercase
              "
            >
              Профіль
            </p>
            <h1 class="text-3xl font-semibold text-highlighted">
              Оновіть дані, які бачать інші користувачі
            </h1>
            <p class="max-w-2xl text-sm/6 text-toned">
              Тут можна змінити ім’я, прізвище й аватар. Email залишається
              основним ідентифікатором входу через Google.
            </p>
          </div>

          <div
            class="
              grid gap-5
              md:grid-cols-2
            "
          >
            <UFormField
              label="Ім'я"
              name="firstName"
              description="Використовується в профілі та списках користувачів."
              required
              size="xl"
            >
              <UInput
                v-model="state.firstName"
                size="xl"
                class="w-full"
                placeholder="Наприклад, Петро"
              />
            </UFormField>

            <UFormField
              label="Прізвище"
              name="lastName"
              description="Допомагає показувати повне ім’я в інтерфейсі."
              required
              size="xl"
            >
              <UInput
                v-model="state.lastName"
                size="xl"
                class="w-full"
                placeholder="Наприклад, Мельник"
              />
            </UFormField>
          </div>

          <UFormField
            label="Email"
            name="email"
            description="Поле доступне лише для перегляду, бо авторизація йде через Google."
            size="xl"
          >
            <UInput
              :modelValue="state.email"
              size="xl"
              class="w-full"
              readonly
              disabled
            />
          </UFormField>
        </div>

        <div
          class="
            rounded-[1.75rem] border border-default bg-linear-to-br
            from-primary/10 via-transparent to-success/10 p-6
          "
        >
          <BaseFilePicker
            v-model="state.avatar"
            name="avatar"
            label="Аватар"
            description="Оберіть квадратне або близьке до квадратного зображення для кращого вигляду."
            hint="PNG, JPG, WEBP, SVG"
          />
        </div>
      </div>
    </section>

    <div class="flex justify-end">
      <UButton
        type="submit"
        size="xl"
        :loading="submitting"
        class="min-w-44 justify-center"
      >
        Зберегти профіль
      </UButton>
    </div>
  </UForm>
</template>

<script setup lang="ts">
import type { IFileResponse, IUserResponse } from "~/types/api.generated";
import { profileSchema } from "~/features/profile/validation";

interface IProfileFormState {
  firstName: string;
  lastName: string;
  email: string;
  avatar?: IFileResponse;
}

const { profile, getProfile, updateProfile } = useProfileStore();

const state = reactive<IProfileFormState>({
  firstName: "",
  lastName: "",
  email: "",
  avatar: undefined,
});

const submitting = ref(false);
const toast = useToast();

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

onMounted(async () => {
  if (!profile.value) {
    await getProfile();
  }

  applyProfile(profile.value);
});

const onSubmit = async (event: {
  data: ReturnType<typeof profileSchema.parse>;
}) => {
  try {
    submitting.value = true;

    const updatedProfile = await updateProfile({
      firstName: event.data.firstName,
      lastName: event.data.lastName,
      avatarFileId: event.data.avatar?.id || null,
    });

    applyProfile(updatedProfile);

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

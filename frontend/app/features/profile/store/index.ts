import type { IUpdateProfile, IUserResponse } from "~/types/api.generated";

export const useProfileStore = () => {
  const { $repository } = useNuxtApp();
  const state = useState("profileStore", () => ({
    profile: null as null | IUserResponse,
  }));

  const getProfile = async () => {
    const response = await $repository.profile.getProfile();
    state.value.profile = response;
  };

  const updateProfile = async (body: IUpdateProfile) => {
    const response = await $repository.profile.updateProfile(body);
    state.value.profile = response;

    return response;
  };

  return {
    ...toComputedStateRefs(state),
    getProfile,
    updateProfile,
  } as const;
};

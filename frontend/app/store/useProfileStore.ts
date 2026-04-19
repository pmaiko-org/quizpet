import type { IUserResponse } from "~/repository/profile";

export const useProfileStore = () => {
  const { $repository } = useNuxtApp();
  const state = useState("profileStore", () => ({
    profile: null as null | IUserResponse,
  }));

  const getProfile = async () => {
    const response = await $repository.profile.getProfile();
    state.value.profile = response;
  };

  return {
    ...toComputedStateRefs(state),
    getProfile,
  } as const;
};

import type {
  IUserListResponse,
  IUserResponse,
} from "~/shared/types/api.generated";

export const usePeopleList = () => {
  const { $repository } = useNuxtApp();

  const {
    items: users,
    meta,
    page,
    pending,
    error,
    refresh,
  } = usePaginatedData<IUserResponse, IUserListResponse>({
    key: "peoples",
    request: query => $repository.users.getUsers(query),
  });

  return {
    users,
    meta,
    page,
    pending,
    error,
    refresh,
  };
};

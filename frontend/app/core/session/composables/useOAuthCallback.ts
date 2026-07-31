import { RouteName } from "~/constants";

export const useOAuthCallback = () => {
  const { setTokens } = useAuthStore();

  onMounted(() => {
    const hash = window.location.hash.startsWith("#")
      ? window.location.hash.slice(1)
      : "";

    if (!hash) return;

    const params = new URLSearchParams(hash);
    const accessToken = params.get("accessToken");
    const refreshToken = params.get("refreshToken");

    if (accessToken && refreshToken) {
      setTokens(accessToken, refreshToken);
      history.replaceState(null, "", window.location.pathname);
      navigateTo({ name: RouteName.INDEX }, { replace: true });
    }
  });
};

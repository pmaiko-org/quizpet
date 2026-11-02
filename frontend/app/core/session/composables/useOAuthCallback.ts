export const useOAuthCallback = () => {
  const route = useRoute();
  const routes = usePageRoutes();
  const { exchangeOAuthCode } = useAuthStore();

  onMounted(async () => {
    const handoff = Array.isArray(route.query.handoff)
      ? route.query.handoff[0]
      : route.query.handoff;
    if (!handoff) return;

    try {
      await exchangeOAuthCode(handoff);
      await navigateTo(routes.resolve("cabinet"), { replace: true });
    } catch {
      await navigateTo(
        { path: routes.resolve("login"), query: { error: "oauth_handoff" } },
        { replace: true },
      );
    }
  });
};

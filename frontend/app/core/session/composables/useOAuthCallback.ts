export const useOAuthCallback = () => {
  const { setTokens } = useAuthStore();
  const route = useRoute();
  const router = useRouter();

  onMounted(() => {
    const accessToken = route.query.accessToken;
    const refreshToken = route.query.refreshToken;

    if (accessToken && refreshToken) {
      setTokens(accessToken as string, refreshToken as string);
      router.replace("/");
    }
  });
};

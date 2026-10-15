import type { TCmsRedirect } from "../core/cms/types";
import { followRedirects } from "../core/cms/utils/redirects";

const cmsUnavailable = () =>
  createError({
    statusCode: 503,
    statusMessage: "CMS content is unavailable",
    fatal: true,
  });

export default defineNuxtRouteMiddleware(async (to) => {
  const { $repository } = useNuxtApp();
  const redirects = useState<TCmsRedirect[] | null>(
    "cms:redirects",
    () => null,
  );

  if (!redirects.value) {
    try {
      redirects.value = await $repository.cms.getRedirects<TCmsRedirect[]>();
    } catch (error) {
      console.error("Failed to load CMS redirects", error);
      return cmsUnavailable();
    }
  }

  const redirect = followRedirects(redirects.value, to.path);
  if (redirect) {
    return navigateTo(
      redirect.to.includes("?")
        ? redirect.to
        : { path: redirect.to, query: to.query, hash: to.hash },
      { redirectCode: redirect.statusCode, replace: true },
    );
  }

  const cmsPage = useCmsPage();
  const resolved = await cmsPage.load(to.path);

  if (!resolved) {
    return cmsPage.error.value ? cmsUnavailable() : undefined;
  }

  setPageLayout(resolved.page.layout);

  const { isLoggedIn } = storeToRefs(useAuthStore());
  const denied =
    (resolved.page.access === "authenticated" && !isLoggedIn.value) ||
    (resolved.page.access === "guestOnly" && isLoggedIn.value);

  if (denied) {
    return navigateTo(resolved.page.redirectTo ?? "/", { replace: true });
  }
});

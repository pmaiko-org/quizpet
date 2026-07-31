import { RouteName } from "~/constants";

const PUBLIC_PATHS = ["/login", "/privacy"];

export default defineNuxtRouteMiddleware((to) => {
  const { isLoggedIn } = storeToRefs(useAuthStore());

  if (isLoggedIn.value && to.path === "/login") {
    return navigateTo({ name: RouteName.INDEX });
  }

  if (!isLoggedIn.value && !PUBLIC_PATHS.includes(to.path)) {
    return navigateTo({ name: RouteName.LOGIN });
  }
});

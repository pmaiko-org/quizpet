const PUBLIC_PATHS = ["/login", "/privacy"];

export default defineNuxtRouteMiddleware((to) => {
  const { isLoggedIn } = storeToRefs(useAuthStore());

  if (isLoggedIn.value && to.path === "/login") {
    return navigateTo("/");
  }

  if (!isLoggedIn.value && !PUBLIC_PATHS.includes(to.path)) {
    return navigateTo("/login");
  }
});

export default defineNuxtRouteMiddleware((to) => {
  const { isLoggedIn } = useAuthStore();

  if (isLoggedIn.value && to.path === "/login") {
    return navigateTo("/");
  }

  if (!isLoggedIn.value && to.path !== "/login") {
    return navigateTo("/login");
  }
});

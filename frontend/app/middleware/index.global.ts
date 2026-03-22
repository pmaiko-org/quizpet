import { useBreakpoints, breakpointsTailwind } from "@vueuse/core";

export default defineNuxtRouteMiddleware(async (to, from) => {
  if (import.meta.client) {
    // const breakpoints = useBreakpoints(breakpointsTailwind)
    // if (breakpoints.smaller('xl').value) {
    //   useUiStore().closeSidebar()
    // }
  }
})
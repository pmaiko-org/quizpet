import { useBreakpoints, breakpointsTailwind } from "@vueuse/core";

export default defineNuxtRouteMiddleware(async (_to, _from) => {
  if (import.meta.client) {
    onNuxtReady(() => {
      const breakpoints = useBreakpoints(breakpointsTailwind);
      if (breakpoints.smaller("xl").value) {
        //
      }
    });
  }
});

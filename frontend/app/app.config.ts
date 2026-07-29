export default defineAppConfig({
  ui: {
    colors: {
      primary: "blue",
      secondary: "orange",
      success: "emerald",
      info: "sky",
      warning: "orange",
      error: "rose",
      neutral: "slate",
    },
    formField: {
      slots: {
        root: "flex flex-col",
        label: "text-sm font-semibold text-highlighted",
        description: "mt-1 text-xs/4 text-muted",
      },
    },
    skeleton: {
      base: "animate-pulse rounded-md bg-muted",
    },
  },
});

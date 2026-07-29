export const useUiStore = defineStore("ui", () => {
  const test = ref(true);

  return {
    test,
  };
});

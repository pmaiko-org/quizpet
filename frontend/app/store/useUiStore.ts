export const useUiStore = () => {
  const state = useState("uiStore", () => ({
    test: true,
  }));

  return {
    ...toComputedStateRefs(state),
  } as const;
};

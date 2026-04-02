export const useRequestStore = () => {
  const state = useState("requestStore", () => ({
    abortControllers: [] as AbortController[],
  }));

  const addAbortController = (abortController: AbortController) => {
    state.value.abortControllers.push(abortController);
  };

  const executeAllAbortControllers = () => {
    state.value.abortControllers.forEach(abortController => {
      abortController.abort();
    });

    state.value.abortControllers = [];
  };

  return {
    ...toComputedStateRefs(state),
    addAbortController,
    executeAllAbortControllers,
  } as const;
};

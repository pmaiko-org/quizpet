export const useAbortSignal = () => {
  let controller: AbortController | null = null;

  const abort = () => {
    controller?.abort();
    controller = null;
  };

  const next = () => {
    abort();
    controller = new AbortController();
    return controller.signal;
  };

  onScopeDispose(abort);

  return { next, abort };
};

import type { TCmsPageResolveResponse } from "../types";

export const useCmsPage = () => {
  const nuxtApp = useNuxtApp();
  const isPreview = useState("cms:is-preview", () =>
    import.meta.server
      ? useRequestHeader("cookie")?.includes("quizpet-cms-preview=") === true
      : false,
  );
  const requestedPath = useState("cms:page-path", () => "");
  const loadedSignature = useState<string | null>(
    "cms:page-loaded",
    () => null,
  );

  const asyncData = useAsyncData(
    "cms:page",
    () =>
      nuxtApp.$repository.cms.getPage<TCmsPageResolveResponse>(
        requestedPath.value,
      ),
    { immediate: false, dedupe: "cancel" },
  );

  const page = computed(() => asyncData.data.value?.page ?? null);
  const params = computed(() => asyncData.data.value?.params ?? {});

  const signatureOf = (path: string) =>
    `${path}:${isPreview.value ? "draft" : "published"}`;

  const load = async (path: string) => {
    if (loadedSignature.value === signatureOf(path)) {
      return asyncData.data.value ?? null;
    }

    requestedPath.value = path;
    await asyncData.execute();

    if (requestedPath.value !== path) {
      return null;
    }

    const loaded = asyncData.data.value ?? null;
    loadedSignature.value = loaded ? signatureOf(path) : null;

    return loaded;
  };

  return {
    data: asyncData.data,
    status: asyncData.status,
    error: asyncData.error,
    page,
    params,
    load,
  };
};

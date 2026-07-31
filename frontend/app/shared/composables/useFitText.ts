type TUseFitTextOptions = {
  minPx?: number;
  maxPx?: number;
  lineHeightRatio?: number;
};

export const useFitText = (options: TUseFitTextOptions = {}) => {
  const { minPx = 16, maxPx = 40, lineHeightRatio = 1.2 } = options;

  const regionRef = ref<HTMLElement | null>(null);
  const contentRef = ref<HTMLElement | null>(null);
  const titleRef = ref<HTMLElement | null>(null);
  const descRef = ref<HTMLElement | null>(null);

  let observer: ResizeObserver | null = null;

  const clearClamp = () => {
    const title = titleRef.value;

    if (title) {
      title.style.removeProperty("display");
      title.style.removeProperty("-webkit-box-orient");
      title.style.removeProperty("-webkit-line-clamp");
      title.style.removeProperty("overflow");
    }

    if (descRef.value) {
      descRef.value.style.removeProperty("display");
    }
  };

  const applyClamp = (lines: number) => {
    const title = titleRef.value;

    if (title) {
      title.style.display = "-webkit-box";
      title.style.setProperty("-webkit-box-orient", "vertical");
      title.style.setProperty("-webkit-line-clamp", String(lines));
      title.style.overflow = "hidden";
    }

    if (descRef.value) {
      descRef.value.style.display = "none";
    }
  };

  const naturalHeight = (size: number) => {
    const content = contentRef.value;

    if (!content) {
      return 0;
    }

    content.style.fontSize = `${size}px`;

    return content.scrollHeight;
  };

  const fit = () => {
    const region = regionRef.value;
    const content = contentRef.value;

    if (!region || !content) {
      return;
    }

    clearClamp();

    const available = region.clientHeight;

    if (available <= 0) {
      return;
    }

    if (naturalHeight(minPx) > available + 1) {
      content.style.fontSize = `${minPx}px`;
      applyClamp(
        Math.max(1, Math.floor(available / (minPx * lineHeightRatio))),
      );

      return;
    }

    let low = minPx;
    let high = maxPx;

    for (let i = 0; i < 16; i++) {
      const mid = (low + high) / 2;

      if (naturalHeight(mid) <= available) {
        low = mid;
      } else {
        high = mid;
      }
    }

    content.style.fontSize = `${Math.floor(low)}px`;
  };

  onMounted(async () => {
    fit();
    await nextTick();
    fit();

    if (typeof ResizeObserver !== "undefined" && regionRef.value) {
      observer = new ResizeObserver(() => fit());
      observer.observe(regionRef.value);
    }
  });

  onBeforeUnmount(() => {
    observer?.disconnect();
    observer = null;
  });

  return {
    regionRef,
    contentRef,
    titleRef,
    descRef,
    fit,
  };
};

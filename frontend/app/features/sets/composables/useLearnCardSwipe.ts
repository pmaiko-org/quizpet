import { useSwipe } from "@vueuse/core";

import type { TLearningOutcome } from "../utils";

const COMMIT_PX = 96;
const DIRECTION_LOCK_PX = 8;
const CLICK_GUARD_MS = 400;
const MAX_ROTATION_DEG = 8;

interface IUseLearnCardSwipeOptions {
  disabled?: () => boolean;
  onTap: () => void;
  onKnown: () => void;
  onMissed: () => void;
}

export const useLearnCardSwipe = (
  target: Ref<HTMLElement | null>,
  { disabled, onTap, onKnown, onMissed }: IUseLearnCardSwipeOptions,
) => {
  const dragX = ref(0);
  const isDragging = ref(false);

  let swallowNextClick = false;
  let clickGuardTimeout: number | null = null;

  const isDisabled = () => disabled?.() ?? false;

  const armClickGuard = () => {
    swallowNextClick = true;

    if (clickGuardTimeout !== null) {
      window.clearTimeout(clickGuardTimeout);
    }

    clickGuardTimeout = window.setTimeout(() => {
      swallowNextClick = false;
      clickGuardTimeout = null;
    }, CLICK_GUARD_MS);
  };

  const { lengthX, lengthY } = useSwipe(target, {
    threshold: 24,
    onSwipe() {
      if (isDisabled()) {
        return;
      }

      if (Math.abs(lengthX.value) <= Math.abs(lengthY.value)) {
        dragX.value = 0;
        isDragging.value = false;
        return;
      }

      isDragging.value = true;
      dragX.value = -lengthX.value;
    },
    onSwipeEnd() {
      const offset = dragX.value;

      isDragging.value = false;

      if (Math.abs(offset) > DIRECTION_LOCK_PX) {
        armClickGuard();
      }

      if (!isDisabled() && offset > COMMIT_PX) {
        onMissed();
        return;
      }

      if (!isDisabled() && offset < -COMMIT_PX) {
        onKnown();
        return;
      }

      dragX.value = 0;
    },
  });

  const swipeStyle = computed(() => {
    if (!dragX.value) {
      return {};
    }

    const rotation = Math.max(
      -MAX_ROTATION_DEG,
      Math.min(MAX_ROTATION_DEG, dragX.value / 18),
    );

    return {
      transform: `translateX(${dragX.value}px) rotate(${rotation}deg)`,
      transition: isDragging.value ? "none" : "transform 200ms ease",
    };
  });

  const swipeHint = computed<TLearningOutcome | null>(() => {
    if (!dragX.value) {
      return null;
    }

    return dragX.value > 0 ? "missed" : "known";
  });

  const swipeHintOpacity = computed(() => {
    return Math.min(1, Math.abs(dragX.value) / COMMIT_PX);
  });

  const onCardClick = () => {
    if (swallowNextClick) {
      swallowNextClick = false;
      return;
    }

    onTap();
  };

  onBeforeUnmount(() => {
    if (clickGuardTimeout !== null) {
      window.clearTimeout(clickGuardTimeout);
    }
  });

  return {
    swipeStyle,
    swipeHint,
    swipeHintOpacity,
    onCardClick,
  };
};

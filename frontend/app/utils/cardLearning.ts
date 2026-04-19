import type { CSSProperties } from "vue";
import type { ICardDetailsResponse } from "~/types/api.generated";

export type LearningOutcome = "known" | "missed";

export interface LearningAttempt {
  outcome: LearningOutcome;
  durationMs: number;
  viewedAnswer: boolean;
  answeredAt: number;
}

export interface LearningCardReport {
  card: ICardDetailsResponse;
  attempts: LearningAttempt[];
  mistakes: number;
  successes: number;
  revealCount: number;
  totalDurationMs: number;
  averageDurationMs: number;
  firstTryKnown: boolean;
}

const DARK_TEXT = "#111827";
const LIGHT_TEXT = "#f8fafc";

const normalizeHexColor = (value?: string | null) => {
  if (!value?.trim()) {
    return null;
  }

  const color = value.trim();

  if (!/^#(?:[0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(color)) {
    return null;
  }

  if (color.length === 4) {
    return `#${color[1]}${color[1]}${color[2]}${color[2]}${color[3]}${color[3]}`;
  }

  return color;
};

const hexToRgb = (value: string) => {
  const normalized = normalizeHexColor(value);

  if (!normalized) {
    return null;
  }

  const hex = normalized.slice(1);

  return {
    r: Number.parseInt(hex.slice(0, 2), 16),
    g: Number.parseInt(hex.slice(2, 4), 16),
    b: Number.parseInt(hex.slice(4, 6), 16),
  };
};

export const toRgba = (value?: string | null, alpha = 1) => {
  const rgb = value ? hexToRgb(value) : null;

  if (!rgb) {
    return null;
  }

  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
};

export const getContrastColor = (background?: string | null) => {
  const rgb = background ? hexToRgb(background) : null;

  if (!rgb) {
    return DARK_TEXT;
  }

  const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;

  return brightness > 160 ? DARK_TEXT : LIGHT_TEXT;
};

export const buildFlashcardTheme = (card: ICardDetailsResponse) => {
  const backgroundColor = normalizeHexColor(card.backgroundColor);
  const textColor
    = normalizeHexColor(card.textColor)
      ?? (backgroundColor ? getContrastColor(backgroundColor) : null);
  const accentColor = textColor ?? backgroundColor ?? "#2563eb";

  const cardStyle: CSSProperties = {
    color: textColor ?? undefined,
    background: backgroundColor
      ? `linear-gradient(160deg, ${toRgba(backgroundColor, 0.98)} 0%, ${toRgba(backgroundColor, 0.88)} 100%)`
      : undefined,
    backgroundColor: backgroundColor ?? undefined,
    borderColor: toRgba(accentColor, 0.28) ?? undefined,
    boxShadow: toRgba(accentColor, 0.18)
      ? `0 30px 80px ${toRgba(accentColor, 0.18)}`
      : undefined,
  };

  const accentStyle: CSSProperties = {
    color: textColor ?? accentColor,
    backgroundColor: toRgba(accentColor, 0.12) ?? undefined,
    borderColor: toRgba(accentColor, 0.18) ?? undefined,
  };

  const imageFrameStyle: CSSProperties = {
    backgroundColor: toRgba(accentColor, 0.08) ?? undefined,
    borderColor: toRgba(accentColor, 0.14) ?? undefined,
  };

  return {
    accentColor,
    textColor,
    backgroundColor,
    cardStyle,
    accentStyle,
    imageFrameStyle,
  };
};

export const formatDuration = (value: number) => {
  const totalSeconds = Math.max(0, Math.round(value / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}г ${String(minutes).padStart(2, "0")}хв`;
  }

  if (minutes > 0) {
    return `${minutes}хв ${String(seconds).padStart(2, "0")}с`;
  }

  return `${seconds}с`;
};

export const formatStopwatch = (value: number) => {
  const totalSeconds = Math.max(0, Math.round(value / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

export const getAccuracy = (reports: LearningCardReport[]) => {
  const attempts = reports.reduce(
    (total, report) => total + report.attempts.length,
    0,
  );

  if (!attempts) {
    return 0;
  }

  const successfulAttempts = reports.reduce(
    (total, report) => total + report.successes,
    0,
  );

  return Math.round((successfulAttempts / attempts) * 100);
};

import type { H3Event } from "h3";

import type { TCmsLocale } from "../../app/core/cms/types";

export const CMS_PREVIEW_COOKIE = "quizpet-cms-preview";
export const CMS_PREVIEW_TOKEN_HEADER = "x-cms-preview-token";

export type TCmsPreviewPayload = {
  path: string;
  locale: TCmsLocale;
  status: "draft";
  expires: number;
  signature: string;
};

export const isSafeCmsPath = (path: string) =>
  path.startsWith("/") && !path.startsWith("//") && !path.includes("\\");

export const parsePreviewToken = (token: string) => {
  try {
    const payload = JSON.parse(
      Buffer.from(token, "base64url").toString("utf8"),
    ) as TCmsPreviewPayload;

    return typeof payload?.path === "string"
      && typeof payload?.signature === "string"
      && typeof payload?.expires === "number"
      && payload?.status === "draft"
      && isSafeCmsPath(payload.path)
      && payload.expires > Date.now()
      ? payload
      : null;
  } catch {
    return null;
  }
};

export const readPreviewToken = (event: H3Event) => {
  const token = getCookie(event, CMS_PREVIEW_COOKIE);

  if (!token) {
    return null;
  }

  const payload = parsePreviewToken(token);

  return payload ? { token, payload } : null;
};

import { createHmac, timingSafeEqual } from "node:crypto";

import type { TCmsLocale } from "../contracts/cms";

export const CMS_PREVIEW_TOKEN_HEADER = "x-cms-preview-token";

export type TCmsPreviewPayload = {
  path: string;
  locale: TCmsLocale;
  status: "draft";
  expires: number;
  signature: string;
};

export const signPreviewPayload = (
  payload: Omit<TCmsPreviewPayload, "signature">,
  secret: string,
): string =>
  createHmac("sha256", secret)
    .update(
      `${payload.path}|${payload.locale}|${payload.status}|${payload.expires}`,
    )
    .digest("base64url");

const parsePreviewToken = (token: string): TCmsPreviewPayload | null => {
  try {
    const payload = JSON.parse(
      Buffer.from(token, "base64url").toString("utf8"),
    ) as TCmsPreviewPayload;

    return typeof payload?.path === "string" &&
      typeof payload?.locale === "string" &&
      typeof payload?.signature === "string" &&
      typeof payload?.expires === "number" &&
      payload?.status === "draft"
      ? payload
      : null;
  } catch {
    return null;
  }
};

export const verifyPreviewToken = (
  token: string,
  expected: { path: string; locale: TCmsLocale },
  secret: string | undefined,
): boolean => {
  const payload = parsePreviewToken(token);

  if (
    !secret ||
    !payload ||
    payload.expires <= Date.now() ||
    payload.path !== expected.path ||
    payload.locale !== expected.locale
  ) {
    return false;
  }

  const expectedSignature = Buffer.from(
    signPreviewPayload(payload, secret),
    "base64url",
  );
  const actualSignature = Buffer.from(payload.signature, "base64url");

  return (
    expectedSignature.length === actualSignature.length &&
    timingSafeEqual(expectedSignature, actualSignature)
  );
};

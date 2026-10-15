import { timingSafeEqual } from "node:crypto";

import { revalidateCms } from "../utils/cms-cache";

const matchesSecret = (candidate: string, expected: string) => {
  const left = Buffer.from(candidate);
  const right = Buffer.from(expected);

  return left.length === right.length && timingSafeEqual(left, right);
};

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const secret = getHeader(event, "x-revalidate-secret");

  if (!config.revalidateSecret) {
    throw createError({
      statusCode: 503,
      statusMessage: "CMS revalidation is not configured",
    });
  }

  if (!secret || !matchesSecret(secret, config.revalidateSecret)) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }

  try {
    return { version: await revalidateCms(config) };
  } catch (error) {
    console.error("CMS revalidation failed", error);
    throw createError({
      statusCode: 503,
      statusMessage: "CMS revalidation is unavailable",
    });
  }
});

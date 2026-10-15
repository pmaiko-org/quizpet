import { getCmsLocales } from "../utils/cms-cache";
import { localizeCmsPath } from "../utils/cms-paths";
import { CMS_PREVIEW_COOKIE, parsePreviewToken } from "../utils/cms-preview";

export default defineEventHandler(async (event) => {
  const token = getQuery(event).token;
  const payload = typeof token === "string" ? parsePreviewToken(token) : null;

  if (!payload || typeof token !== "string") {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid preview link",
    });
  }

  setCookie(event, CMS_PREVIEW_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(payload.expires),
  });

  const locales = await getCmsLocales(useRuntimeConfig(event));

  return sendRedirect(
    event,
    localizeCmsPath(locales, payload.path, payload.locale),
  );
});

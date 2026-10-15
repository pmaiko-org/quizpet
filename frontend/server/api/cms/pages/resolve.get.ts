import { getCmsLocales, getCmsPage } from "../../../utils/cms-cache";
import { splitCmsPath } from "../../../utils/cms-paths";
import { isSafeCmsPath, readPreviewToken } from "../../../utils/cms-preview";

const MAX_PATH_LENGTH = 512;

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const query = getQuery(event);
  const requestedPath = typeof query.path === "string" ? query.path : "/";

  if (!isSafeCmsPath(requestedPath) || requestedPath.length > MAX_PATH_LENGTH) {
    throw createError({ statusCode: 400, statusMessage: "Invalid path" });
  }

  const { locale, path } = splitCmsPath(
    await getCmsLocales(config),
    requestedPath,
  );
  const preview = readPreviewToken(event);
  const previewToken
    = preview
      && preview.payload.path === path
      && preview.payload.locale === locale
      ? preview.token
      : undefined;

  return getCmsPage(config, locale, path, previewToken);
});

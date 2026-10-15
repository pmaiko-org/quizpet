import { getCmsBootstrap, getCmsLocales } from "../../utils/cms-cache";
import { splitCmsPath } from "../../utils/cms-paths";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const query = getQuery(event);
  const path = typeof query.path === "string" ? query.path : "/";
  const { locale } = splitCmsPath(await getCmsLocales(config), path);

  return getCmsBootstrap(config, locale);
});

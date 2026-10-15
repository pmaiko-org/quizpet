import { getCmsBootstrap, getCmsLocales } from "../utils/cms-cache";
import { localizeCmsPath } from "../utils/cms-paths";

const escapeXml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&apos;");

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const locales = await getCmsLocales(config);
  const bootstraps = await Promise.all(
    locales.map(locale => getCmsBootstrap(config, locale.code)),
  );
  const origin = getRequestURL(event).origin;
  const urls = bootstraps
    .flatMap(({ locale, routes }) =>
      routes.map(route => ({ ...route, locale })),
    )
    .filter(
      route =>
        route.access === "public"
        && !route.noIndex
        && !route.path.includes(":")
        && route.routeName !== "not-found",
    )
    .map(
      route =>
        `<url><loc>${escapeXml(`${origin}${localizeCmsPath(locales, route.path, route.locale)}`)}</loc></url>`,
    )
    .join("");

  setHeader(event, "content-type", "application/xml; charset=utf-8");
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;
});

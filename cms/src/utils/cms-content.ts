import type { Core } from "@strapi/strapi";

import { pageContractErrors } from "./cms-validation";
import {
  cmsBlockSchema,
  cmsBootstrapResponseSchema,
  cmsPageResolveResponseSchema,
  cmsRedirectsResponseSchema,
  type TCmsBootstrapResponse,
  type TCmsLocale,
  type TCmsLocaleSetting,
  type TCmsPageResolveResponse,
  type TCmsRedirectsResponse,
} from "../contracts/cms";

export const NOT_FOUND_ROUTE = "not-found";

type TUnknownRecord = Record<string, unknown>;

type TPageDocument = TUnknownRecord & {
  documentId: string;
  title: string;
  path: string;
  routeName: string;
  access: "public" | "authenticated" | "guestOnly";
  layout: "default" | "landing" | "cabinet" | "empty";
  showBreadcrumbs: boolean;
  priority?: number | null;
  parent?: TPageDocument | null;
  redirectTo?: TPageDocument | null;
  seo?: TUnknownRecord | null;
  blocks?: TUnknownRecord[];
};

export const getLocaleSettings = async (
  strapi: Core.Strapi,
): Promise<TCmsLocaleSetting[]> => {
  const service = strapi.plugin("i18n").service("locales");
  const [locales, defaultCode] = await Promise.all([
    service.find() as Promise<{ code: string; name: string }[]>,
    service.getDefaultLocale() as Promise<string>,
  ]);

  const settings = locales.map((item) => ({
    code: item.code,
    name: item.name,
    isDefault: item.code === defaultCode,
  }));

  if (!settings.some((item) => item.isDefault)) {
    throw new Error("CMS default locale is not configured");
  }

  return settings;
};

const defaultOf = (settings: TCmsLocaleSetting[]) =>
  settings.find((item) => item.isDefault)!.code;

export const resolveLocale = (
  settings: TCmsLocaleSetting[],
  requested: string | undefined,
) =>
  settings.find((item) => item.code === requested)?.code ?? defaultOf(settings);

export const publicPath = (
  locale: TCmsLocale,
  path: string,
  defaultLocale: TCmsLocale,
) => (locale === defaultLocale ? path : `/${locale}${path === "/" ? "" : path}`);

const media = (value: unknown) => {
  if (!value || typeof value !== "object") {
    return null;
  }

  const item = value as TUnknownRecord;
  return {
    url: String(item.url ?? ""),
    alternativeText:
      typeof item.alternativeText === "string" ? item.alternativeText : null,
    width: typeof item.width === "number" ? item.width : null,
    height: typeof item.height === "number" ? item.height : null,
  };
};

const seo = (value: unknown, forceNoIndex = false) => {
  const item = (value && typeof value === "object" ? value : {}) as TUnknownRecord;

  return {
    metaTitle: String(item.metaTitle ?? ""),
    metaDescription: String(item.metaDescription ?? ""),
    ogImage: media(item.ogImage),
    canonicalUrl:
      typeof item.canonicalUrl === "string" ? item.canonicalUrl : null,
    noIndex: forceNoIndex || item.noIndex === true,
  };
};

const link = (
  value: unknown,
  locale: TCmsLocale,
  defaultLocale: TCmsLocale,
) => {
  if (!value || typeof value !== "object") {
    return null;
  }

  const item = value as TUnknownRecord;
  const linkedPage = item.page as TUnknownRecord | undefined;
  const isExternal = item.isExternal === true;
  const rawPath = isExternal
    ? String(item.url ?? "")
    : String(linkedPage?.path ?? item.url ?? "");

  if (!rawPath) {
    return null;
  }

  return {
    label: String(item.label ?? ""),
    path: isExternal ? rawPath : publicPath(locale, rawPath, defaultLocale),
    isExternal,
    icon: typeof item.icon === "string" ? item.icon : null,
  };
};

const withLinks = (
  block: TUnknownRecord,
  locale: TCmsLocale,
  defaultLocale: TCmsLocale,
) => {
  if (
    block.__component !== "widgets.callout-widget" &&
    block.__component !== "widgets.hero-widget" &&
    block.__component !== "widgets.spotlight-widget"
  ) {
    return block;
  }

  return {
    ...block,
    primaryLink: link(block.primaryLink, locale, defaultLocale),
    secondaryLink: link(block.secondaryLink, locale, defaultLocale),
  };
};

const normalizeBlocks = (
  strapi: Core.Strapi,
  routeName: string,
  blocks: TUnknownRecord[],
  locale: TCmsLocale,
  defaultLocale: TCmsLocale,
) =>
  blocks.flatMap((block) => {
    const normalized = withLinks(block, locale, defaultLocale);
    const parsed = cmsBlockSchema.safeParse(normalized);

    if (!parsed.success) {
      strapi.log.error(
        `CMS content: block "${String(block.__component)}" on page "${routeName}" does not match the contract and is ignored: ${parsed.error.message}`,
      );
      return [];
    }

    return [parsed.data];
  });

const splitPath = (path: string) => path.split("/").filter(Boolean);

const decodeSegment = (segment: string) => {
  try {
    return decodeURIComponent(segment);
  } catch {
    return null;
  }
};

export const matchPath = (pattern: string, actualPath: string) => {
  const patternSegments = splitPath(pattern);
  const actualSegments = splitPath(actualPath);

  if (patternSegments.length !== actualSegments.length) {
    return null;
  }

  const params: Record<string, string> = {};

  for (let index = 0; index < patternSegments.length; index += 1) {
    const expected = patternSegments[index]!;
    const actual = actualSegments[index]!;

    if (expected.startsWith(":")) {
      const decoded = decodeSegment(actual);

      if (decoded === null) {
        return null;
      }

      params[expected.slice(1)] = decoded;
      continue;
    }

    if (expected !== actual) {
      return null;
    }
  }

  return params;
};

const staticSegmentCount = (path: string) =>
  splitPath(path).filter((segment) => !segment.startsWith(":")).length;

export const fillParams = (path: string, params: Record<string, string>) =>
  path.replace(/:([A-Za-z0-9_]+)/g, (match, name: string) => {
    const value = params[name];
    return value === undefined ? match : encodeURIComponent(value);
  });

const usablePages = (strapi: Core.Strapi, pages: TPageDocument[]) => {
  const byPath = new Map<string, TPageDocument>();

  for (const page of pages) {
    const taken = byPath.get(page.path);

    if (taken) {
      strapi.log.error(
        `CMS content: page "${page.routeName}" duplicates the path "${page.path}" already used by "${taken.routeName}" and is ignored`,
      );
      continue;
    }

    for (const message of pageContractErrors({
      routeName: page.routeName,
      path: page.path,
      parentPath: page.parent?.path,
    })) {
      strapi.log.error(`CMS content: ${message}`);
    }

    byPath.set(page.path, page);
  }

  return [...byPath.values()];
};

const getPages = async (
  strapi: Core.Strapi,
  locale: TCmsLocale,
  status: "published" | "draft",
) => {
  const pages = (await strapi.documents("api::page.page").findMany({
    locale,
    status,
    populate: {
      parent: true,
      redirectTo: true,
      seo: { populate: ["ogImage"] },
      blocks: { populate: "*" },
    },
    limit: -1,
  })) as unknown as TPageDocument[];

  return usablePages(strapi, pages);
};

export const findPage = (pages: TPageDocument[], path: string) => {
  const exact = pages.find((page) => page.path === path && !page.path.includes(":"));
  if (exact) {
    return { page: exact, params: {} };
  }

  return pages
    .filter((page) => page.path.includes(":"))
    .map((page) => ({ page, params: matchPath(page.path, path) }))
    .filter(
      (candidate): candidate is { page: TPageDocument; params: Record<string, string> } =>
        candidate.params !== null,
    )
    .sort(
      (left, right) =>
        staticSegmentCount(right.page.path) - staticSegmentCount(left.page.path) ||
        (right.page.priority ?? 0) - (left.page.priority ?? 0),
    )[0];
};

const getBreadcrumbs = (
  page: TPageDocument,
  pages: TPageDocument[],
  locale: TCmsLocale,
  defaultLocale: TCmsLocale,
  params: Record<string, string>,
) => {
  const byDocumentId = new Map(pages.map((item) => [item.documentId, item]));
  const chain: TPageDocument[] = [];
  const visited = new Set<string>();
  let current: TPageDocument | undefined = page;

  while (current && chain.length < 10) {
    if (visited.has(current.documentId)) {
      throw new Error(`Cyclic page parent relation at ${current.routeName}`);
    }

    visited.add(current.documentId);
    chain.unshift(current);
    current = current.parent?.documentId
      ? byDocumentId.get(current.parent.documentId)
      : undefined;
  }

  if (current) {
    throw new Error(`Page parent depth exceeds 10 at ${page.routeName}`);
  }

  return chain.map((item) => ({
    title: item.title,
    path: publicPath(locale, fillParams(item.path, params), defaultLocale),
  }));
};

export const getBootstrap = async (
  strapi: Core.Strapi,
  locale: TCmsLocale,
): Promise<TCmsBootstrapResponse> => {
  const [localeSettings, translations, pages, global] = await Promise.all([
    getLocaleSettings(strapi),
    strapi.documents("api::translation.translation").findMany({
      locale,
      limit: -1,
    }),
    getPages(strapi, locale, "published"),
    strapi.documents("api::global.global").findFirst({
      locale,
      populate: {
        defaultSeo: { populate: ["ogImage"] },
        logo: true,
        favicon: true,
        sidebarLinks: { populate: { page: { fields: ["path"] } } },
        footerLinks: { populate: { page: { fields: ["path"] } } },
        socialLinks: { populate: { page: { fields: ["path"] } } },
      },
    }),
  ]);

  if (!global) {
    throw new Error(`CMS global content is missing for locale ${locale}`);
  }

  const defaultLocale = defaultOf(localeSettings);

  const globalRecord = global as unknown as TUnknownRecord;
  const normalizeLinks = (value: unknown) =>
    Array.isArray(value)
      ? value
          .map((item) => link(item, locale, defaultLocale))
          .filter((item) => item !== null)
      : [];

  return cmsBootstrapResponseSchema.parse({
    locale,
    locales: localeSettings,
    translations: Object.fromEntries(
      (translations as unknown as TUnknownRecord[]).map((item) => [
        String(item.key),
        String(item.value),
      ]),
    ),
    routes: pages.map((page) => ({
      routeName: page.routeName,
      path: page.path,
      access: page.access,
      noIndex: page.access !== "public" || page.seo?.noIndex === true,
    })),
    global: {
      siteName: String(globalRecord.siteName),
      defaultSeo: seo(globalRecord.defaultSeo),
      logo: media(globalRecord.logo),
      favicon: media(globalRecord.favicon),
      sidebarLinks: normalizeLinks(globalRecord.sidebarLinks),
      footerLinks: normalizeLinks(globalRecord.footerLinks),
      socialLinks: normalizeLinks(globalRecord.socialLinks),
      footerTagline:
        typeof globalRecord.footerTagline === "string"
          ? globalRecord.footerTagline
          : null,
    },
  });
};

const getAlternates = async (
  strapi: Core.Strapi,
  routeName: string,
  params: Record<string, string>,
  status: "published" | "draft",
  localeSettings: TCmsLocaleSetting[],
  defaultLocale: TCmsLocale,
) => {
  const entries = await Promise.all(
    localeSettings.map(async ({ code }) => {
      const page = (await strapi.documents("api::page.page").findFirst({
        locale: code,
        status,
        filters: { routeName },
        fields: ["path"],
      })) as { path: string } | null;

      return page
        ? ([code, publicPath(code, fillParams(page.path, params), defaultLocale)] as const)
        : null;
    }),
  );

  return Object.fromEntries(entries.filter((entry) => entry !== null));
};

export const resolvePage = async (
  strapi: Core.Strapi,
  path: string,
  locale: TCmsLocale,
  status: "published" | "draft",
): Promise<TCmsPageResolveResponse> => {
  const localeSettings = await getLocaleSettings(strapi);
  const defaultLocale = defaultOf(localeSettings);

  const pages = await getPages(strapi, locale, status);
  const notFound = pages.find((page) => page.routeName === NOT_FOUND_ROUTE);
  const match =
    findPage(pages, path) ?? (notFound ? { page: notFound, params: {} } : null);

  if (!match) {
    throw new Error(`CMS not-found page is missing for locale ${locale}`);
  }

  const { page, params } = match;
  const fallbackRedirectName =
    page.access === "authenticated"
      ? "login"
      : page.access === "guestOnly"
        ? "cabinet"
        : null;
  const redirectPage = page.redirectTo ??
    (fallbackRedirectName
      ? pages.find((item) => item.routeName === fallbackRedirectName)
      : null);
  const forceNoIndex =
    status === "draft" ||
    page.access !== "public" ||
    page.routeName === NOT_FOUND_ROUTE;

  return cmsPageResolveResponseSchema.parse({
    page: {
      routeName: page.routeName,
      title: page.title,
      layout: page.layout,
      access: page.access,
      redirectTo: redirectPage
        ? publicPath(locale, fillParams(redirectPage.path, params), defaultLocale)
        : null,
      showBreadcrumbs: page.showBreadcrumbs,
      seo: seo(page.seo, forceNoIndex),
      breadcrumbs: getBreadcrumbs(page, pages, locale, defaultLocale, params),
      blocks: normalizeBlocks(
        strapi,
        page.routeName,
        page.blocks ?? [],
        locale,
        defaultLocale,
      ),
      alternates: await getAlternates(
        strapi,
        page.routeName,
        params,
        status,
        localeSettings,
        defaultLocale,
      ),
    },
    params,
  });
};

export const getRedirects = async (
  strapi: Core.Strapi,
): Promise<TCmsRedirectsResponse> => {
  const redirects = await strapi.documents("api::redirect.redirect").findMany({
    limit: -1,
  });

  return cmsRedirectsResponseSchema.parse(
    (redirects as unknown as TUnknownRecord[]).map((item) => ({
      from: String(item.from),
      to: String(item.to),
      statusCode: Number(item.statusCode),
    })),
  );
};

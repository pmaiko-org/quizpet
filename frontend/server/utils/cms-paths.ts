import type { TCmsLocale, TCmsLocaleSetting } from "../../app/core/cms/types";

const localePrefix = (locale: TCmsLocaleSetting) =>
  locale.isDefault ? "" : `/${locale.code}`;

export const localizeCmsPath = (
  locales: TCmsLocaleSetting[],
  path: string,
  code: TCmsLocale,
) => {
  const locale = locales.find(item => item.code === code);
  const prefix = locale ? localePrefix(locale) : "";
  return `${prefix}${path === "/" ? "" : path}` || "/";
};

export const splitCmsPath = (locales: TCmsLocaleSetting[], path: string) => {
  const matched = locales.find((locale) => {
    const prefix = localePrefix(locale);
    return prefix !== "" && (path === prefix || path.startsWith(`${prefix}/`));
  });
  const fallback = locales.find(locale => locale.isDefault);
  const locale = matched ?? fallback;

  if (!locale) {
    throw new Error("CMS locales are unavailable");
  }

  const prefix = localePrefix(locale);

  return {
    locale: locale.code,
    path: (matched ? path.slice(prefix.length) : path) || "/",
  };
};

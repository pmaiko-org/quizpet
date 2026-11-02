import { readdir, readFile } from "node:fs/promises";
import { extname, join, resolve } from "node:path";

import {
  globalTranslationEntries,
  widgetTranslationValues,
} from "./seed/translations.ts";

const LOCALES = ["uk", "en"];
const root = resolve(import.meta.dirname, "../..");
const frontendRoot = join(root, "frontend/app");

const collectFiles = async (directory) => {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const path = join(directory, entry.name);
      return entry.isDirectory() ? collectFiles(path) : [path];
    }),
  );

  return files.flat();
};

const sourceFiles = (await collectFiles(frontendRoot)).filter((path) =>
  [".ts", ".vue"].includes(extname(path)),
);
const globalKeys = new Set();
const widgetKeys = new Set();
const sourceContents = [];

for (const path of sourceFiles) {
  const source = await readFile(path, "utf8");
  sourceContents.push(source);
  const usesWidgetI18n = source.includes("useCmsWidgetI18n");
  const globalMatches = source.matchAll(
    usesWidgetI18n
      ? /\$t\(\s*["']([^"']+)["']/g
      : /(?:\$t|\bt)\(\s*["']([^"']+)["']/g,
  );
  const widgetMatches = source.matchAll(
    usesWidgetI18n
      ? /(?:\$wt|\bt|translate)\(\s*["']([^"']+)["']/g
      : /translate\(\s*["']([^"']+)["']/g,
  );

  for (const match of globalMatches) {
    globalKeys.add(match[1]);
  }

  for (const match of widgetMatches) {
    widgetKeys.add(match[1]);
  }
}

const availableWidgetKeys = new Set(
  Object.values(widgetTranslationValues).flatMap((localized) =>
    Object.values(localized ?? {}).flatMap((messages) => Object.keys(messages)),
  ),
);
const availableGlobalTranslations = new Map(
  globalTranslationEntries.map(({ key, values }) => [key, values]),
);
const hasQuotedKey = (key) =>
  sourceContents.some(
    (source) => source.includes(`"${key}"`) || source.includes(`'${key}'`),
  );

const failures = [];

for (const key of [...globalKeys].sort()) {
  const locales = availableGlobalTranslations.get(key);

  if (!locales) {
    failures.push(`${key}: missing from the seed`);
    continue;
  }

  const missing = LOCALES.filter((locale) => !locales[locale]);

  if (missing.length) {
    failures.push(`${key}: missing locales ${missing.join(", ")}`);
  }
}

for (const key of [...widgetKeys].sort()) {
  if (!availableWidgetKeys.has(key) && !availableGlobalTranslations.has(key)) {
    failures.push(`${key}: missing from widget and global translations`);
  }
}

for (const key of [...availableGlobalTranslations.keys()].sort()) {
  if (!globalKeys.has(key) && !hasQuotedKey(key)) {
    failures.push(`${key}: unused global translation`);
  }
}

for (const key of [...availableWidgetKeys].sort()) {
  if (!widgetKeys.has(key)) {
    failures.push(`${key}: unused widget translation`);
  }
}

if (failures.length) {
  throw new Error(`Translation contract check failed:\n${failures.join("\n")}`);
}

console.log(
  `Translation contract check passed for ${globalKeys.size} global and ${widgetKeys.size} widget keys in ${LOCALES.join(", ")}.`,
);

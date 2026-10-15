import { readdir, readFile } from "node:fs/promises";
import { extname, join, resolve } from "node:path";

const LOCALES = ["uk", "en"];
const root = resolve(import.meta.dirname, "../..");
const frontendRoot = join(root, "frontend/app");
const seedPath = join(root, "cms/scripts/seed.ts");

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
const usedKeys = new Set();

for (const path of sourceFiles) {
  const source = await readFile(path, "utf8");
  const matches = source.matchAll(/(?:\$t|\bt|translate)\(\s*["']([^"']+)["']/g);

  for (const match of matches) {
    usedKeys.add(match[1]);
  }
}

const seed = await readFile(seedPath, "utf8");
const translationsBlock = seed.match(
  /^const translations[^=]*=\s*\{\n(?<body>[\s\S]*?)\n\};$/m,
);

if (!translationsBlock) {
  throw new Error(
    `Could not locate the "const translations" object in ${seedPath}`,
  );
}

const body = translationsBlock.groups.body;
const entries = [...body.matchAll(/^\s*"(?<key>[A-Za-z0-9._-]+)":\s*\{/gm)];
const seededLocales = new Map(
  entries.map((entry, index) => [
    entry.groups.key,
    new Set(
      [
        ...body
          .slice(
            entry.index + entry[0].length,
            entries[index + 1]?.index ?? body.length,
          )
          .matchAll(/(?:^|[{,])\s*(?<locale>[A-Za-z-]+):\s*["'`]/g),
      ].map((locale) => locale.groups.locale),
    ),
  ]),
);

const failures = [];

for (const key of [...usedKeys].sort()) {
  const locales = seededLocales.get(key);

  if (!locales) {
    failures.push(`${key}: missing from the seed`);
    continue;
  }

  const missing = LOCALES.filter((locale) => !locales.has(locale));

  if (missing.length) {
    failures.push(`${key}: missing locales ${missing.join(", ")}`);
  }
}

if (failures.length) {
  throw new Error(`Translation contract check failed:\n${failures.join("\n")}`);
}

console.log(
  `Translation contract check passed for ${usedKeys.size} keys in ${LOCALES.join(", ")}.`,
);

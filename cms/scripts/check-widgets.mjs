import { existsSync, readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

const cmsRoot = resolve(import.meta.dirname, "..");
const projectRoot = resolve(cmsRoot, "..");
const widgetsRoot = resolve(cmsRoot, "src/components/widgets");
const pageSchema = JSON.parse(
  readFileSync(
    resolve(cmsRoot, "src/api/page/content-types/page/schema.json"),
    "utf8",
  ),
);
const contract = readFileSync(resolve(cmsRoot, "src/contracts/cms.ts"), "utf8");
const registry = readFileSync(
  resolve(projectRoot, "frontend/app/features/cms/registry/widgetRegistry.ts"),
  "utf8",
);
const seed = readFileSync(resolve(cmsRoot, "scripts/seed.ts"), "utf8");

const schemaFiles = readdirSync(widgetsRoot).filter((file) => file.endsWith(".json"));
const schemaUids = new Set(schemaFiles.map((file) => `widgets.${file.slice(0, -5)}`));
const allowedUids = new Set(pageSchema.attributes.blocks.components);
const contractUids = new Set(
  [...contract.matchAll(/z\.literal\("(widgets\.[a-z0-9-]+-widget)"\)/g)].map(
    (match) => match[1],
  ),
);
const registryRoot = resolve(projectRoot, "frontend/app/features/cms/registry");
const registryWidgets = new Map(
  [
    ...registry.matchAll(
      /"(widgets\.[a-z0-9-]+-widget)": widget\(\s*\(\) => import\("([^"]+)"\)/g,
    ),
  ].map(([, uid, path]) => [
    uid,
    path.startsWith("~/")
      ? resolve(projectRoot, "frontend/app", path.slice(2))
      : resolve(registryRoot, path),
  ]),
);
const registryUids = new Set(registryWidgets.keys());
const seedUids = new Set([
  ...[...seed.matchAll(/__component: "(widgets\.[a-z0-9-]+-widget)"/g)].map(
    (match) => match[1],
  ),
  ...[...seed.matchAll(/functionalBlock\("([a-z0-9-]+)"\)/g)].map(
    (match) => `widgets.${match[1]}-widget`,
  ),
]);

const failures = [];
const compare = (label, actual) => {
  const missing = [...schemaUids].filter((uid) => !actual.has(uid));
  const extra = [...actual].filter((uid) => !schemaUids.has(uid));
  if (missing.length || extra.length) {
    failures.push(`${label}: missing [${missing}], extra [${extra}]`);
  }
};

compare("page dynamic zone", allowedUids);
compare("Zod contract", contractUids);
compare("frontend registry", registryUids);
compare("seed", seedUids);


for (const file of schemaFiles) {
  const apiId = file.slice(0, -5);
  const uid = `widgets.${apiId}`;
  const schema = JSON.parse(readFileSync(resolve(widgetsRoot, file), "utf8"));
  const words = apiId
    .replace(/-widget$/, "")
    .split("-")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
  const expectedDisplayName = `${words} Widget`;

  if (!apiId.endsWith("-widget")) {
    failures.push(`${uid}: API ID must end with -widget`);
  }
  if (schema.info.displayName !== expectedDisplayName) {
    failures.push(
      `${uid}: displayName must be ${expectedDisplayName}, got ${schema.info.displayName}`,
    );
  }
  if (!registryWidgets.has(uid) || !existsSync(registryWidgets.get(uid))) {
    failures.push(`${uid}: Vue component referenced by the registry is missing`);
  }
}

if (failures.length) {
  throw new Error(`Widget contract check failed:\n${failures.join("\n")}`);
}

console.log(`Widget contract check passed for ${schemaUids.size} widgets.`);

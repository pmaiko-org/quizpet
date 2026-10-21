import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const cmsRoot = resolve(import.meta.dirname, "..");
const frontendTypesRoot = resolve(cmsRoot, "../frontend/app/core/cms/types");

const files = ["contentTypes.d.ts", "components.d.ts"];

for (const file of files) {
  const source = readFileSync(resolve(cmsRoot, "types/generated", file), "utf8")
    .replaceAll('from "@strapi/strapi"', 'from "@strapi/types"')
    .replaceAll(
      'declare module "@strapi/strapi"',
      'declare module "@strapi/types"'
    );
  const destination = resolve(
    frontendTypesRoot,
    file.replace(".d.ts", ".generated.d.ts")
  );

  writeFileSync(destination, source);
}

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const frontendRoot = path.resolve(import.meta.dirname, "..");
const generatedFilePath = path.join(
  frontendRoot,
  "app",
  "types",
  "api.generated.ts"
);
const openApiFilePath = path.resolve(
  frontendRoot,
  "..",
  "backend",
  "openapi.json"
);

const openApiDocument = JSON.parse(readFileSync(openApiFilePath, "utf8"));
const schemaNames = Object.keys(openApiDocument.components?.schemas ?? {});

const aliases = schemaNames
  .map(schemaName => [toAliasName(schemaName), schemaName])
  .filter(([aliasName]) => aliasName)
  .sort((left, right) => left[0].localeCompare(right[0]));

const aliasBlock = [
  "",
  "",
  'type ApiSchemas = components["schemas"];',
  "",
  ...aliases.map(
    ([aliasName, schemaName]) =>
      `export type ${aliasName} = ApiSchemas["${schemaName}"];`
  ),
  "",
].join("\n");

const generatedContents = readFileSync(generatedFilePath, "utf8").replace(
  /\n*type ApiSchemas = components\["schemas"\][\s\S]*$/,
  ""
);

writeFileSync(generatedFilePath, `${generatedContents}${aliasBlock}`);

function toAliasName(schemaName) {
  if (schemaName.endsWith("ResponseDto")) {
    return `I${schemaName.slice(0, -3)}`;
  }

  if (schemaName.endsWith("Dto")) {
    return `I${schemaName.slice(0, -3)}`;
  }

  return `I${schemaName}`;
}

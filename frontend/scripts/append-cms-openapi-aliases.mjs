import { appendFileSync } from "node:fs";
import { resolve } from "node:path";

const target = resolve(
  import.meta.dirname,
  "../app/core/cms/types/api.generated.ts",
);

appendFileSync(
  target,
  `
export type TCmsBootstrapResponse = paths["/bootstrap"]["get"]["responses"][200]["content"]["application/json"];
export type TCmsPageResolveResponse = paths["/pages/resolve"]["get"]["responses"][200]["content"]["application/json"];
export type TCmsRedirectsResponse = paths["/redirects"]["get"]["responses"][200]["content"]["application/json"];
`,
);

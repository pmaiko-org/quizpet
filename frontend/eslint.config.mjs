// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs";
import betterTailwindcss from "eslint-plugin-better-tailwindcss";
import simpleImportSort from "eslint-plugin-simple-import-sort";

import { fileURLToPath } from "node:url";
import { dirname, relative, resolve } from "node:path";

const LAYER_HEIGHT = {
  "shared": 0,
  "core": 1,
  "features": 2,
  "pages": 3,
  "app-infra": 4,
};

const layerOfFile = (filename) => {
  const f = filename.replace(/\\/g, "/");

  if (
    /\/app\/(plugins|middleware|layouts)\//.test(f)
    || /\/app\/(app|error)\.vue$/.test(f)
    || /\/app\/app\.config\.ts$/.test(f)
  ) {
    return "app-infra";
  }
  if (/\/features\//.test(f)) return "features";
  if (/\/core\//.test(f)) return "core";
  if (/\/pages\//.test(f)) return "pages";
  if (
    /\/app\/(components|composables|utils|repository|types|store)\//.test(f)
    || /\/app\/(constants|validation)\.ts$/.test(f)
  ) {
    return "shared";
  }

  return null;
};

const layerOfImport = (importPath) => {
  if (typeof importPath !== "string" || !importPath.startsWith("~/")) {
    return null;
  }

  const rest = importPath.slice(2);

  if (rest.startsWith("features/")) return "features";
  if (rest.startsWith("core/")) return "core";
  if (rest.startsWith("pages/")) return "pages";
  if (/^(plugins|middleware|layouts)\//.test(rest)) return "app-infra";
  if (
    /^(components|composables|utils|repository|types|store)(\/|$)/.test(rest)
  ) {
    return "shared";
  }
  if (/^(constants|validation)(\.|\/|$)/.test(rest)) return "shared";

  return null;
};

const featureOf = (value, pattern) => {
  const match = value.replace(/\\/g, "/").match(pattern);
  return match ? match[1] : null;
};

/** @type {import("eslint").Linter.Plugin} */
const localPlugin = {
  rules: {
    "layer-imports": {
      meta: {
        type: "problem",
        messages: {
          layer:
            "Layer \"{{current}}\" must not import from higher layer "
            + "\"{{imported}}\" (allowed direction: "
            + "pages → features → core → shared).",
          crossFeature:
            "Feature \"{{current}}\" must not import from feature "
            + "\"{{imported}}\". Share code via core/ or app-level "
            + "composables/, utils/, components/.",
        },
      },
      create(context) {
        const check = (node) => {
          if (!node.source) return;

          const currentLayer = layerOfFile(context.filename);
          if (!currentLayer) return;

          const importPath = node.source.value;
          const importedLayer = layerOfImport(importPath);
          if (!importedLayer) return;

          if (LAYER_HEIGHT[importedLayer] > LAYER_HEIGHT[currentLayer]) {
            context.report({
              node,
              messageId: "layer",
              data: { current: currentLayer, imported: importedLayer },
            });
            return;
          }

          if (currentLayer === "features" && importedLayer === "features") {
            const current = featureOf(
              context.filename,
              /\/features\/([^/]+)\//,
            );
            const imported = featureOf(importPath, /^~\/features\/([^/]+)/);

            if (current && imported && current !== imported) {
              context.report({
                node,
                messageId: "crossFeature",
                data: { current, imported },
              });
            }
          }
        };

        return {
          ImportDeclaration: check,
          ExportNamedDeclaration: check,
          ExportAllDeclaration: check,
        };
      },
    },

    "relative-within-feature": {
      meta: {
        type: "suggestion",
        fixable: "code",
        messages: {
          relative:
            "Imports inside module \"{{layer}}/{{module}}\" must be relative, "
            + "not via the \"~/{{layer}}/{{module}}/…\" alias of the same module.",
        },
      },
      create(context) {
        const check = (node) => {
          if (!node.source) return;

          const importPath = node.source.value;
          if (typeof importPath !== "string" || !importPath.startsWith("~/")) {
            return;
          }

          const target = importPath.match(
            /^~\/(features|core)\/([^/]+)(?:\/|$)/,
          );
          if (!target) return;
          const [, layer, module] = target;

          const self = context.filename
            .replace(/\\/g, "/")
            .match(/\/(features|core)\/([^/]+)\//);
          if (!self) return;

          if (self[1] !== layer || self[2] !== module) return;

          context.report({
            node: node.source,
            messageId: "relative",
            data: { layer, module },
            fix(fixer) {
              const file = context.filename.replace(/\\/g, "/");
              const appIndex = file.lastIndexOf("/app/");
              if (appIndex === -1) return null;

              const appRoot = file.slice(0, appIndex + "/app".length);
              const targetAbs = appRoot + importPath.slice(1);
              let rel = relative(dirname(file), targetAbs).replace(/\\/g, "/");
              if (!rel.startsWith(".")) rel = `./${rel}`;

              const quote = node.source.raw[0];
              return fixer.replaceText(node.source, `${quote}${rel}${quote}`);
            },
          });
        };

        return {
          ImportDeclaration: check,
          ExportNamedDeclaration: check,
          ExportAllDeclaration: check,
        };
      },
    },
  },
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default withNuxt()
  .append({
    files: ["app/**/*.{ts,mts,vue}"],
    plugins: {
      "local": localPlugin,
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      "local/layer-imports": "error",
      "local/relative-within-feature": "error",
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
    },
  })
  .append(
    betterTailwindcss.configs["recommended-error"],

    {
      settings: {
        "better-tailwindcss": {
          entryPoint: resolve(__dirname, "app/assets/css/main.css"),
        },
      },
      rules: {
        "better-tailwindcss/enforce-consistent-line-wrapping": "error",
        "better-tailwindcss/enforce-consistent-variant-order": "error",
        "better-tailwindcss/enforce-consistent-variable-syntax": "error",
        "better-tailwindcss/enforce-consistent-important-position": "error",
        "better-tailwindcss/enforce-shorthand-classes": "error",
        "better-tailwindcss/no-unknown-classes": "off",
      },
    },
  )
  .override("nuxt/typescript/rules", {
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-dynamic-delete": "off",
    },
  })
  .append({
    files: ["**/*.vue"],
    rules: {
      "vue/attribute-hyphenation": [
        "error",
        "never",
        {
          ignore: [],
        },
      ],

      "vue/prop-name-casing": ["error", "camelCase"],
    },
  })
  .append({
    files: ["app/**/*.{ts,mts,vue}"],
    rules: {
      "@stylistic/operator-linebreak": [
        "error",
        "after",
        { overrides: { "?": "before", ":": "before" } },
      ],
    },
  });

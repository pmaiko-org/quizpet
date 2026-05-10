// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs";
import betterTailwindcss from "eslint-plugin-better-tailwindcss";

import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

/** @type {import("eslint").Linter.Plugin} */
const localPlugin = {
  rules: {
    "no-cross-feature-imports": {
      meta: {
        type: "problem",
        messages: {
          crossFeature:
            "Feature \"{{current}}\" must not import from feature \"{{imported}}\". "
            + "Share code via app-level composables/, utils/, or components/.",
        },
      },
      create(context) {
        return {
          ImportDeclaration(node) {
            const importPath = node.source.value;
            const filename = context.filename;

            const fileMatch = filename.match(
              /[/\\]features[/\\]([^/\\]+)[/\\]/,
            );
            if (!fileMatch) return;
            const currentFeature = fileMatch[1];

            const importMatch = importPath.match(
              /(?:~\/features\/|\/features\/)([^/]+)/,
            );
            if (!importMatch) return;
            const importedFeature = importMatch[1];

            if (importedFeature !== currentFeature) {
              context.report({
                node,
                messageId: "crossFeature",
                data: { current: currentFeature, imported: importedFeature },
              });
            }
          },
        };
      },
    },
  },
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default withNuxt()
  .append({
    files: ["app/features/**"],
    plugins: { local: localPlugin },
    rules: {
      "local/no-cross-feature-imports": "error",
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
  });

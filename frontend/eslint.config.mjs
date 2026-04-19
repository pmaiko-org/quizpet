// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs";
import betterTailwindcss from "eslint-plugin-better-tailwindcss";

import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default withNuxt()
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
  });

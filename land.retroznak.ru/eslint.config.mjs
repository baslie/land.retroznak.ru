import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// Import custom typograf rule
const requireTypografRule = require("./scripts/eslint-rules/require-typograf.js");

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
  {
    // Custom typograf rule for Russian typography
    plugins: {
      "@local": {
        rules: {
          "require-typograf": requireTypografRule,
        },
      },
    },
    rules: {
      "@local/require-typograf": [
        "warn",
        {
          minWordCount: 3,
          ignoredComponents: ["Script", "Head", "meta"],
        },
      ],
    },
  },
];

export default eslintConfig;

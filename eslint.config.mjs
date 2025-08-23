import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

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
    overrides: [
      {
        files: ["src/app/page.tsx"],
        rules: {
          '@typescript-eslint/no-unsafe-argument': 'off',
          '@typescript-eslint/no-explicit-any': 'off',
          '@typescript-eslint/ban-ts-comment': 'off',
          'no-restricted-globals': 'off',
        },
      },
    ],
  },
];

export default eslintConfig;

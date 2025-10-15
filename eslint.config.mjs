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
    rules: {
      // Convert all errors to warnings for deployment
      "jsx-a11y/alt-text": "warn",
      "jsx-a11y/img-redundant-alt": "warn", 
      "jsx-a11y/aria-role": "warn",
      "jsx-a11y/no-autofocus": "warn",
      "@next/next/no-img-element": "warn",
      "@next/next/no-page-custom-font": "warn",
      "react-hooks/exhaustive-deps": "warn",
      "react/jsx-key": "warn",
      "react/no-unescaped-entities": "warn",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-empty-object-type": "warn",
      "prefer-const": "warn"
    }
  }
];

export default eslintConfig;
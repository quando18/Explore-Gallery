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
      // Accessibility rules
      "jsx-a11y/alt-text": "error",
      "jsx-a11y/img-redundant-alt": "error",
      "jsx-a11y/aria-role": "error",
      "jsx-a11y/no-autofocus": "warn",
      
      // Performance rules
      "@next/next/no-img-element": "error",
      "@next/next/no-page-custom-font": "warn",
      
      // Code quality rules
      "react-hooks/exhaustive-deps": "warn",
      "react/jsx-key": "error",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    }
  }
];

export default eslintConfig;
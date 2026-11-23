import { defineConfig, globalIgnores } from "eslint/config";
import jsxA11y from "eslint-plugin-jsx-a11y";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import tseslint from "typescript-eslint";

// Bis 23.11.2026 kamen diese Regeln aus eslint-config-next. Das lud den Parser aus dem Paket `next`, das die Seite
// nicht braucht. Jetzt dieselben Bausteine direkt, ohne die Regeln, die nur für Next-Seiten gelten.
const eslintConfig = defineConfig([
  // Nur erzeugte Ordner auslassen; build/ enthält unsere Vite-Plugins und wird geprüft.
  globalIgnores(["dist/**", ".qa-output/**", ".sites-runtime/**", "work/**", "test-results/**", "playwright-report/**"]),
  {
    files: ["**/*.{js,jsx,mjs,ts,tsx,mts,cts}"],
    plugins: {react, "react-hooks": reactHooks, "jsx-a11y": jsxA11y},
    languageOptions: {
      sourceType: "module",
      globals: {...globals.browser, ...globals.node},
    },
    settings: {react: {version: "detect"}},
    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      "react/no-unknown-property": "off",
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "react/jsx-no-target-blank": "off",
      "jsx-a11y/alt-text": ["warn", {elements: ["img"]}],
      "jsx-a11y/aria-props": "warn",
      "jsx-a11y/aria-proptypes": "warn",
      "jsx-a11y/aria-unsupported-elements": "warn",
      "jsx-a11y/role-has-required-aria-props": "warn",
      "jsx-a11y/role-supports-aria-props": "warn",
    },
  },
  // TypeScript-Parser und empfohlene Regeln für alle Dateien, auch .mjs (so war es auch mit eslint-config-next).
  ...tseslint.configs.recommended,
  {
    rules: {
      // Rest-Muster wie ({active, ...site}) => site lassen Felder bewusst weg.
      "@typescript-eslint/no-unused-vars": ["warn", {ignoreRestSiblings: true}],
      "@typescript-eslint/no-unused-expressions": "warn",
    },
  },
  {
    files: ["components/ui/**/*.{ts,tsx}"],
    rules: {
      // These files are vendored verbatim from shadcn@4.17.0. Keep the
      // registry source intact while applying the stricter rules to Site code.
      "@typescript-eslint/no-unused-vars": "off",
      "react-hooks/purity": "off",
      "react-hooks/set-state-in-effect": "off",
    },
  },
]);

export default eslintConfig;

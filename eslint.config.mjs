import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Nur erzeugte Ordner auslassen; build/ enthält unsere Vite-Plugins und wird geprüft.
  globalIgnores(["dist/**", ".qa-output/**", ".sites-runtime/**", "work/**", "test-results/**", "playwright-report/**"]),
  // Rest-Muster wie ({active, ...site}) => site lassen Felder bewusst weg.
  {rules:{"@typescript-eslint/no-unused-vars":["warn",{ignoreRestSiblings:true}]}},
  {files:["app/**/*.{ts,tsx}"],rules:{
    // Eigene Bilder haben feste Maße, laden träge und liegen im Offline-Vorrat; einen Bild-Dienst von Next gibt es hier nicht.
    "@next/next/no-img-element":"off",
  }},
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

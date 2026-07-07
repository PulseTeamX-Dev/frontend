import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import boundaries from "eslint-plugin-boundaries";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    plugins: {
      boundaries,
    },
    languageOptions: {
      globals: globals.browser,
    },
    settings: {
      "boundaries/elements": [
        { type: "app", pattern: "src/app/*" },
        { type: "pages", pattern: "src/pages/*" },
        { type: "features", pattern: "src/features/*", capture: ["feature"] },
        { type: "shared", pattern: "src/shared/*" },
      ],
    },
    rules: {
      "boundaries/dependencies": [
        "error",
        {
          default: "disallow",
          policies: [
            {
              from: { element: { type: "shared" } },
              allow: { to: { element: { type: "shared" } } },
            },
            {
              from: { element: { type: "features" } },
              allow: {
                to: [
                  { element: { type: "shared" } },
                  {
                    element: {
                      type: "features",
                      captured: {
                        feature: "{{ from.element.captured.feature }}",
                      },
                    },
                  },
                ],
              },
            },
            {
              from: { element: { type: "pages" } },
              allow: {
                to: [
                  { element: { type: "features" } },
                  { element: { type: "shared" } },
                ],
              },
            },
            {
              from: { element: { type: "app" } },
              allow: {
                to: [
                  { element: { type: "features" } },
                  { element: { type: "shared" } },
                  { element: { type: "pages" } },
                ],
              },
            },
          ],
        },
      ],
    },
  },
]);

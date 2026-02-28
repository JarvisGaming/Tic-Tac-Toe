import js from "@eslint/js";
import globals from "globals";
import css from "@eslint/css";
import { defineConfig } from "eslint/config";
import stylistic from '@stylistic/eslint-plugin';

export default defineConfig([
  { files: ["**/*.{js,mjs,cjs}"], plugins: { js }, extends: ["js/recommended"], languageOptions: { globals: globals.browser } },
  { files: ["**/*.js"], languageOptions: { sourceType: "script" } },
  { files: ["**/*.css"], plugins: { css }, language: "css/css", extends: ["css/recommended"] },
  {
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "warn",
    },
  },
  {
    plugins: {
      '@stylistic': stylistic
    },
    rules: {
      '@stylistic/semi': ['error', 'always'],
    }
  }
]);
import { FlatCompat } from '@eslint/eslintrc';
import globals from 'globals';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import ESLint from '@eslint/js';
import ESLintConfigPrettier from 'eslint-config-prettier';
import Vue from 'eslint-plugin-vue';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const compat = new FlatCompat({ baseDirectory: __dirname });

export default [
  {
    ignores: ['**/public/*', '**/dist/*', 'backend/sign.cjs'],
  },
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
  },
  ESLint.configs.recommended,
  ESLintConfigPrettier,
  ...Vue.configs['flat/recommended'],
  ...compat.extends('@vue/eslint-config-prettier/skip-formatting'),
  {
    rules: {
      'no-empty': 'off',
      'no-unused-vars': 'off',
      'vue/multi-word-component-names': 'off',
    },
  },
];

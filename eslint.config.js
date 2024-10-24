import globals from 'globals';
import ESLint from '@eslint/js';
import ESLintConfigPrettier from 'eslint-config-prettier';
import Vue from 'eslint-plugin-vue';
import prettierConfig from '@vue/eslint-config-prettier';

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
  prettierConfig,
  {
    rules: {
      'no-empty': 'off',
      'no-unused-vars': 'off',
      'vue/multi-word-component-names': 'off',
    },
  },
];

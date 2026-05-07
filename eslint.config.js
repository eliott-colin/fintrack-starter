import js from '@eslint/js';
import globals from 'globals';
import pluginReact from 'eslint-plugin-react';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    files: [
      '**/*.test.{js,jsx}',
      '**/__tests__/**/*.{js,jsx}',
      'tests/**/*.spec.js',
      'tests-e2e/**/*.spec.js',
    ],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: {
      globals: { ...globals.jest, ...globals.browser, test: 'readonly', expect: 'readonly' },
      sourceType: 'module',
    },
  },
  {
    files: ['babel.config.cjs', 'jest.config.cjs', 'playwright.config.js'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: globals.node,
    },
  },
  {
    files: ['**/*.{js,mjs,jsx}'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: {
      globals: globals.browser,
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
  {
    ...pluginReact.configs.flat.recommended,
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
]);

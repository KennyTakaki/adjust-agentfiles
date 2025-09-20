import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

export default [
  // ignore list
  {
    ignores: [
      '**/dist/**',
      '**/build/**',
      '**/out/**',
      '**/coverage/**',
      '**/node_modules/**',
      '**/.pnpm-store/**',
      '**/.turbo/**',
      '**/.cache/**',
      '**/.devcontainer/**',
      '**/.vscode/**',
      '**/.tmp/**',
      '**/.temp/**',
      '**/.vitest/**',
      '**/.next/**',
      '**/jest.config.{js,cjs,mjs,ts}',
      '.pnpm-debug.log',
      '**/*.log',
      '**/storybook-static/**',
      '**/cdk.out/**',
      '**/.eslintcache',
    ],
  },

  // JS 推奨
  js.configs.recommended,

  // TypeScript 推奨（配列なのでスプレッドでフラット化）
  ...tseslint.configs.recommended,

  // ts/tsx 専用設定
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: true,
        sourceType: 'module',
        ecmaVersion: 2020,
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs['recommended-latest'].rules,
      ...reactRefresh.configs.vite.rules,
    },
  },
];

// jest.config.mjs
import { createDefaultPreset } from 'ts-jest';

const { transform } = createDefaultPreset();

/** @type {import('jest').Config} */
export default {
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { useESM: true, isolatedModules: true }],
  },
  // TypeScript を ESM として扱う
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  globals: { 'ts-jest': { useESM: true, isolatedModules: true } },

  // dist の重複実行を防ぐ
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],

  // 必要なら src 配下だけを対象に
  // testMatch: ['**/src/**/__test__/**/*.test.(ts|tsx|js)'],
};

/** @type {import('jest').Config} */
export default {
  rootDir: new URL('.', import.meta.url).pathname,
  testEnvironment: 'node',
  // ← 正規表現のドットをエスケープして「.ts / .tsx」を確実にマッチさせる
  transform: { '^.+\\.tsx?$': ['ts-jest', { useESM: true, isolatedModules: true }] },
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  // 「src だけ」を明示すると dist 読み込み事故も防げます
  testMatch: ['<rootDir>/src/**/__test__/**/*.test.(ts|tsx|js)'],
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/dist/'],
};

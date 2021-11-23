export default {
  roots: ['<rootDir>/src'],
  collectCoverageFrom: ['<rootDir>/src/**/*.ts', '!<rootDir>/src/main/**'],
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
  testMatch: ['**/*.spec.ts'],
  transform: {
    '.+\\.ts$': 'ts-jest',
  },
  preset: '@shelf/jest-mongodb',
};

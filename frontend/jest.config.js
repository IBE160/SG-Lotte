const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    // Handle module aliases (if you have configured them in tsconfig.json)
    '^@/components/(.*)$': '<rootDir>/components/$1',
    '^@/lib/(.*)$': '<rootDir>/lib/$1',
  },
  testEnvironment: 'jest-environment-jsdom',
  // if using TypeScript with a baseUrl set to the root directory then you need the below for `paths` to work
  moduleDirectories: ['node_modules', '<rootDir>/'],
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/', '<rootDir>/coverage/'],
  collectCoverageFrom: [
    './**/*.{js,jsx,ts,tsx}',
    '!./**/*.d.ts',
    '!./**/index.{js,jsx,ts,tsx}',
    '!./**/{mocks,stories}/**',
    '!./**/*.config.{js,ts}',
    '!./**/coverage/**',
    '!./.next/**',
    '!./node_modules/**',
  ],
};

// createJestConfig is exported in this way to ensure that next/jest can load the Next.js configuration, which is async
module.exports = createJestConfig(customJestConfig);
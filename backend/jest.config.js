module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/__tests__/**',
  ],
  coverageThreshold: {
    global: {
      lines:      90,
      functions:  90,
      branches:   90,
      statements: 90,
    },
  },
};

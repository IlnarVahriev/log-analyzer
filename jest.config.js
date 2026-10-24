module.exports = {
  testEnvironment: 'node',
  collectCoverageFrom: ['src/**/*.js', 'index.js'],
  coverageThreshold: {
    global: {
      lines: 80,
      statements: 80,
      functions: 80,
      branches: 70
    }
  },
  coverageReporters: ['text', 'html']
};

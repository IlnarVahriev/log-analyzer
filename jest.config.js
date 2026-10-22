module.exports = {
  testEnvironment: 'node',
  // Какие файлы учитывать в покрытии
  collectCoverageFrom: ['src/**/*.js', 'index.js'],
  // Минимальное покрытие — 80%
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
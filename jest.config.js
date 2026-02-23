/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['dotenv/config'], // Загружаем .env перед тестами
  testMatch: ['**/*.test.ts'],
  verbose: true,
};

// jest.config.js
// Corre solo sobre la lógica de negocio pura (tablas fiscales, cálculos,
// formatters) — nada aquí importa react-native, así que no hace falta el
// preset pesado de jest-expo ni mocks de módulos nativos.
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  clearMocks: true,
};

 module.exports = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/?(*.)+(test).ts'],
  extensionsToTreatAsEsm: ['.ts'],
};
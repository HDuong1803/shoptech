/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: '@shelf/jest-mongodb',
  testEnvironment: 'node',
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.json'
    }
  },
  transform: {
    '^.+\\.ts?$': 'ts-jest'
  },
  moduleNameMapper: {
    '@app': '<rootDir>/src/app/index.ts',
    '@constants': '<rootDir>/src/constants/index.ts',
    '@middlewares': '<rootDir>/src/middlewares/index.ts',
    '@schemas': '<rootDir>/src/schemas/index.ts',
    '@providers': '<rootDir>/src/providers/index.ts'
  },
  modulePathIgnorePatterns: ['<rootDir>/build/', '<rootDir>/node_modules/'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts']
}

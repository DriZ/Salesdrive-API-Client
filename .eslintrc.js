module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: [
	'.eslintrc.js', 
	'dist/', 
	'docs/', 
	'node_modules/', 
	'jest.config.js', 
	'tsconfig.json',
	'package.json',
	'package-lock.json',
	'orders.test.ts'
],
  rules: {
    '@typescript-eslint/no-explicit-any': 'off', // off, warn, error
    '@typescript-eslint/explicit-module-boundary-types': 'off',
  },
};

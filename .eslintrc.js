module.exports = {
  root: true,
  ignorePatterns: ['.eslintrc.js', 'vite.config.ts'],
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'airbnb-base',
    'airbnb-typescript/base'
  ],
  parserOptions: {
    ecmaVersion: 2021,
    project: './tsconfig.json'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/prefer-default-export': 'off',
    'import/no-unresolved': 'off',
    'import/extensions': 'off',
    'no-restricted-syntax': 'off',
    'no-param-reassign': 'off'
  },
};

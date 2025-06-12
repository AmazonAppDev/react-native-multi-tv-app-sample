const prettier = require('eslint-plugin-prettier');

module.exports = [
  {
    files: ['**/*.ts', '**/*.tsx'],
    ignores: ['node_modules/**', 'build/**', 'dist/**'],
    languageOptions: {
      parser: require('@typescript-eslint/parser'),
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        React: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
      react: require('eslint-plugin-react'),
      prettier: prettier,
    },
    rules: {
      semi: ['warn', 'always'],
      'prefer-const': 'error',
      'react/jsx-filename-extension': ['error', { extensions: ['.tsx'] }],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'prettier/prettier': [
        'warn',
        {
          endOfLine: 'auto',
          usePrettierrc: true,
        },
      ],
    },
  },
];

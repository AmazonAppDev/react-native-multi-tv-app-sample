const prettier = require('eslint-plugin-prettier');

module.exports = [
  {
    files: ["**/*.ts", "**/*.tsx"],
    ignores: ["node_modules/**", "build/**", "dist/**"],
    languageOptions: {
      parserOptions: {
        parser: "@typescript-eslint/parser",
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true, // Enable JSX support
        },
      },
      globals: {
        React: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": require("@typescript-eslint/eslint-plugin"),
      "react": require("eslint-plugin-react"),
      "react-native": require("eslint-plugin-react-native"),
      "prettier": prettier,
    },
    rules: {
      semi: ["warn", "always"],
      "prefer-const": "error",
      "react-native/no-unused-styles": "warn",
      "react-native/split-platform-components": "warn",
      "react-native/no-inline-styles": "error",
      "react/jsx-filename-extension": ["error", { extensions: [".tsx"] }],
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/colon-trailing-spacing": ["off"],
      "prettier/prettier": ["warn", {
        "endOfLine": "auto",
        "usePrettierrc": true, // Use .prettierrc file for configuration
      }]
    },
  },
];
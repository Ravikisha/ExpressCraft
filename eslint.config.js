export default [
  {
    files: ["**/*.js", "**/*.mjs"],
    ignores: ["node_modules/**", "lib/sass_compiler.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        process: "readonly",
        console: "readonly",
        __dirname: "readonly",
      },
    },
    rules: {
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "no-undef": "error",
      "prefer-const": "warn",
    },
  },
];

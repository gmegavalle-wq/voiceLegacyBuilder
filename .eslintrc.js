module.exports = {
  env: {
    browser: true,
    es2021: true,
    jest: true, // 👈 CLAVE para arreglar describe/it/expect
  },
  extends: [
    "eslint:recommended",
    "prettier",
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
};
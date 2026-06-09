module.exports = {
  root: true,
  extends: [
    "expo",
    "prettier"
  ],
  plugins: [
    "prettier"
  ],
  env: {
    browser: true,
    node: true,
    es2021: true
  },
  rules: {
    "prettier/prettier": "warn",
    "no-console": ["warn", { allow: ["warn", "error"] }]
  }
};
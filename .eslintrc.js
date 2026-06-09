module.exports = {
  root: true,
  extends: ['expo', 'prettier'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'warn',
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'react-native/no-unused-styles': 'warn',
  },
  env: {
    'react-native/react-native': true,
  },
};
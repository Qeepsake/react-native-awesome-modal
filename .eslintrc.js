module.exports = {
  extends: [
    '@react-native-community',
    'plugin:prettier/recommended',
    'plugin:react/recommended',
  ],
  plugins: ['simple-import-sort'],
  root: true,
  rules: {
    'import/order': 'off',
    'simple-import-sort/exports': 'error',
    'simple-import-sort/imports': 'error',
    'sort-imports': 'off',
  },
}

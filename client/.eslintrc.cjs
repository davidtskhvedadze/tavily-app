module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'indent': ['error', 2], 
    'space-before-blocks': 'error', 
    'keyword-spacing': 'error', 
    'no-multiple-empty-lines': ['error', { 'max': 1 }], 
    'space-in-parens': ['error', 'never'], 
    'object-curly-spacing': ['error', 'always'], 
  },
}

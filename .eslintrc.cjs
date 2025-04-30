/* eslint-env node */
module.exports = {
  root: true,
  'extends': [
    'plugin:vue/vue3-essential',
    'eslint:recommended'
  ],
  env: {
    node: true // Add this line to enable Node.js global variables
  },
  'globals': {
    "requestAnimationFrame": "writable"
  },
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    'no-unused-vars': ['warn', { 'argsIgnorePattern': '^_' }] // Warn on unused vars, but ignore if starts with _
  }
}

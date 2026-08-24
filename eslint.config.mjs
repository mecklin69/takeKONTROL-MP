import globals from 'globals';

/**
 * Two environments in one repository: server/ and tools/ run in Node,
 * public/assets/js/ runs in a browser. The shared catalogue must run in
 * both, so it gets neither set of globals — if a browser or Node API
 * ever creeps into it, this config is what notices.
 */
export default [
  {
    ignores: ['node_modules/**', 'data/**', 'legacy/**']
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module'
    },
    linterOptions: {
      reportUnusedDisableDirectives: true
    },
    rules: {
      'no-undef': 'error',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-var': 'error',
      'prefer-const': 'warn',
      eqeqeq: ['error', 'smart'],
      'no-console': 'off'
    }
  },
  {
    files: ['server/**/*.js', 'tools/**/*.js', 'tests/**/*.js'],
    languageOptions: { globals: { ...globals.node } }
  },
  {
    files: ['public/assets/js/**/*.js'],
    languageOptions: { globals: { ...globals.browser } }
  },
  {
    // Must stay runnable under both. No globals on purpose.
    files: ['public/assets/js/shared/**/*.js'],
    languageOptions: { globals: {} }
  }
];

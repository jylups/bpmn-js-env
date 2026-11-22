import js from '@eslint/js';
import globals from 'globals';

/*
 * Lints the workspace's own scripts. Each package and the playground have
 * their own config.
 */
export default [
  js.configs.recommended,
  {
    files: [ 'scripts/**/*.js', 'eslint.config.js' ],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node
      }
    }
  }
];

import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';

// Replaces .eslintrc.js, which extended CRA's "react-app" preset.
export default tseslint.config(
    { ignores: ['build/', 'coverage/', 'node_modules/', 'resources/'] },
    js.configs.recommended,
    ...tseslint.configs.recommended,
    jsxA11y.flatConfigs.recommended,
    {
        files: ['src/**/*.{ts,tsx}'],
        languageOptions: { globals: globals.browser },
        plugins: { 'react-hooks': reactHooks },
        rules: {
            'no-console': 'warn',
            '@typescript-eslint/no-explicit-any': 'error',
            '@typescript-eslint/no-unused-vars': 'warn',
            'jsx-a11y/no-autofocus': 'off',
            'react-hooks/exhaustive-deps': 'error',
            'react-hooks/rules-of-hooks': 'error',
        },
    },
    {
        files: ['src/service-worker.js'],
        languageOptions: { globals: globals.serviceworker },
    },
    {
        files: ['src/generateThumbnails.cjs'],
        languageOptions: { globals: globals.node, sourceType: 'commonjs' },
        rules: { '@typescript-eslint/no-require-imports': 'off' },
    },
);

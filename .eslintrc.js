module.exports = {
    extends: [
        'react-app',
        'react-app/jest',
        'plugin:jsx-a11y/recommended',
    ],
    plugins: ['jsx-a11y'],
    rules: {
        'no-console': 'warn',
        '@typescript-eslint/no-explicit-any': 'error',
        '@typescript-eslint/no-unused-vars': 'warn',
        'jsx-a11y/no-autofocus': 'off',
        'react-hooks/exhaustive-deps': 'error',
        'react-hooks/rules-of-hooks': 'error',
    },
};

import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import importPlugin from 'eslint-plugin-import';
import pluginReact from 'eslint-plugin-react';
import sortKeys from 'eslint-plugin-sort-keys';
import globals from 'globals';

export default defineConfig([
    pluginReact.configs.flat.recommended,
    js.configs.recommended,
    {
        files: ['**/*.{js,mjs,cjs,jsx}'],
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
                webpack: 'readonly',
            },
        },
    },
    {
        files: ['**/*.{js,jsx,mjs,cjs}'],
        plugins: { import: importPlugin },
        rules: {
            'import/no-duplicates': ['error', { considerQueryString: true }],
            'import/order': [
                'error',
                {
                    'groups': [
                        'builtin',
                        'external',
                        'internal',
                        'parent',
                        'sibling',
                        'index',
                        'object',
                        'type',
                    ],
                    'pathGroups': [
                        {
                            pattern: 'react{,-*}',
                            group: 'external',
                            position: 'before',
                        },
                        {
                            pattern: '**/*.css',
                            group: 'index',
                            position: 'after',
                        },
                        {
                            pattern: 'constants',
                            group: 'internal',
                            position: 'after',
                        },
                    ],
                    'pathGroupsExcludedImportTypes': ['react'],
                    'alphabetize': { order: 'asc', caseInsensitive: true },
                    'newlines-between': 'always',
                },
            ],
        },
    },
    {
        files: ['**/links.jsx'],
        plugins: { 'sort-keys': sortKeys },
        rules: {
            'sort-keys/sort-keys-fix': 'error',
        },
    },
]);

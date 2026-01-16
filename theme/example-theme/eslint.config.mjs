import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'build/**',
      '.source/**',
      'next-env.d.ts',
    ],
  },
  {
    files: [
      'src/lib/**/*.ts',
      'src/lib/**/*.tsx',
      'src/mdx-components.tsx',
      'src/components/**/*.tsx',
    ],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      // 多数のプラグイン/rehype/remark の型が複雑なため一旦 any を許容
    },
  },
];

export default eslintConfig;

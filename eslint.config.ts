import eslintConfigStandard from '@ianchoi/eslint-config-standard'
import eslintConfigTypescript from '@ianchoi/eslint-config-typescript'
import {defineConfig} from 'eslint/config'

export default defineConfig([
  {
    ignores: ['**/node_modules/**', '**/dist/**', '**/coverage/**', '**/*.tsbuildinfo'],
  },
  ...eslintConfigStandard,
  ...eslintConfigTypescript,
  {
    files: [
      '**/eslint.config.ts',
      '**/eslint.config.tsx',
      '**/tsup.config.ts',
      '**/vitest.config.ts',
      '**/*.test.ts',
    ],
    rules: {
      'import-x/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: true,
          optionalDependencies: false,
          peerDependencies: true,
        },
      ],
    },
  },
])

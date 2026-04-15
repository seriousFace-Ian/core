import eslintConfigStandard from '@ianchoi/eslint-config-standard'
import eslintConfigTypescript from '@ianchoi/eslint-config-typescript'
import {defineConfig} from 'eslint/config'

export default defineConfig([
  ...eslintConfigStandard,
  ...eslintConfigTypescript,
  {
    files: ['**/eslint.config.ts', '**/eslint.config.tsx'],
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

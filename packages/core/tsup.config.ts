import {defineConfig} from 'tsup'

export default defineConfig({
  // 入口文件
  entry: ['./src/index.ts'],

  // 输出格式配置
  format: ['esm', 'cjs'],

  dts: {
    compilerOptions: {
      ignoreDeprecations: '6.0',
    },
  },

  outDir: 'dist',
  splitting: true,
  treeshake: true,
  clean: true,
  minify: false,
  sourcemap: true,
})

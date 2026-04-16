import {defineConfig} from 'tsup'

export default defineConfig({
  // 入口文件
  entry: ['./src/index.ts'],

  // 输出格式配置
  format: ['esm', 'cjs'],

  // 是否生成类型定义文件 (.d.ts)
  dts: true,

  outDir: 'dist',
  splitting: true,
  treeshake: true,
  clean: true,
  minify: false,
  sourcemap: true,
})

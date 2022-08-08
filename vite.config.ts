import { resolve } from 'path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig(({ mode }) => {
  const isProd = mode === 'production'

  let build = {}

  if (isProd) {
    build = {
      lib: {
        entry: resolve(__dirname, 'src/index.ts'),
        name: 'supercharged-slider',
        fileName: (format) => `index.js`,
        formats: ['es'],
      },
    }
  }

  return {
    plugins: [dts({
      insertTypesEntry: true,
    }),],
    build,
    resolve: {
      alias: [
        {
          find: '~',
          replacement: resolve(__dirname, './src'),
        },
      ],
    },
    server: {
      hmr: false
    }
  }
})

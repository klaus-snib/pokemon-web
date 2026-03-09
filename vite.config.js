import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        adapter: resolve(__dirname, 'battle-adapter.js')
      },
      output: {
        entryFileNames: 'assets/[name]-[hash].js'
      }
    }
  }
})

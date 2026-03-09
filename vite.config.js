import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    outDir: '.',  // Output to project root
    emptyOutDir: false,  // Don't wipe existing files!
    lib: {
      entry: resolve(__dirname, 'battle-adapter.js'),
      name: 'BattleAdapter',
      fileName: 'battle-adapter.bundle',
      formats: ['iife']  // IIFE = browser-ready, no module system needed
    },
    rollupOptions: {
      output: {
        name: 'BattleAdapterLib'
      }
    }
  }
})

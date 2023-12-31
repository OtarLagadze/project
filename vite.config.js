import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // build: {
  //   rollupOptions: {
  //     // ... other rollup options ...
  //   },
  //   esbuild: {
  //     loader: {
  //       '.svg': 'file', // Use 'file' loader for SVG files
  //     },
  //   },
  // },
})

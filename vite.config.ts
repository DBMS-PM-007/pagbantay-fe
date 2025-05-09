import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import svgr from "vite-plugin-svgr";

export default defineConfig({
  plugins: [react(), svgr()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@ui': path.resolve(__dirname, 'src/components/ui'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@services': path.resolve(__dirname, 'src/services'),
    }
  }
})


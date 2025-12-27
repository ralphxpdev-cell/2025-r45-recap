import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

export default defineConfig({
  // GitHub Pages용 base 경로 (레포 이름)
  base: '/2025-r45-recap/',

  plugins: [react()],

  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  build: {
    target: 'esnext',
    outDir: 'dist', // GitHub Pages용 빌드 결과
  },

  server: {
    port: 3000,
    open: true,
  },
})

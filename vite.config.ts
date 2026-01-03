import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/typemaster/',  // Add this for GitHub Pages subpath
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});

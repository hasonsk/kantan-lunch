import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://l6pz1qjw-3000.asse.devtunnels.ms/',
        changeOrigin: true,
      },
    },
  },
});

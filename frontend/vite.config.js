import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/order': {
        target: 'https://3uhcgg5udg.execute-api.eu-north-1.amazonaws.com', // Din API-server
        changeOrigin: true, // För att byta origin till serverns domän
        rewrite: (path) => path.replace(/^\/order/, ''), // Ändra path om det behövs
      },
    },
  },
});

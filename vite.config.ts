import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { crx } from '@crxjs/vite-plugin';
import manifest from './manifest.json';

export default defineConfig({
  plugins: [
    react(),
    crx({ manifest })
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    rollupOptions: {
      input: {
        popup: 'src/popup/popup.html',
        sidepanel: 'src/sidepanel/sidepanel.html',
        'floating-button': 'public/floating-button.html'
      }
    }
  }
});
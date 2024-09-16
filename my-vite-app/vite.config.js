import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src', // Shortcut for importing from the src directory
    },
  },
  server: {
    port: 3000, // Your dev server will run on port 3000
  },
});

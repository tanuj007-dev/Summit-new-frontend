import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      // Proxy all /api/* to backend (avoids CORS in dev)
      '/api': {
        target: 'https://api.summithomeappliance.com',
        changeOrigin: true,
        secure: false,
      },
      '/storage': {
        target: 'https://api.summithomeappliance.com',
        changeOrigin: true,
        secure: false,
      },
      '/getMegaMenu.php': {
        target: 'https://api.summithomeappliance.com',
        changeOrigin: true,
        secure: false,
      },
      '/products.php': {
        target: 'https://api.summithomeappliance.com',
        changeOrigin: true,
        secure: false,
      },
      '/php_admin_panel': {
        target: 'https://api.summithomeappliance.com',
        changeOrigin: true,
        secure: false,
      },
      '/wishlistupload.php': {
        target: 'https://api.summithomeappliance.com',
        changeOrigin: true,
        secure: false,
      },
      '/getcatproducts.php': {
        target: 'https://api.summithomeappliance.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [react(), tailwindcss()],
})
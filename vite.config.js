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
        target: process.env.VITE_API_PROXY_TARGET || 'https://api.summithomeappliance.com',
        changeOrigin: true,
        secure: true,
      },
      // PHP endpoints used by Header (getMegaMenu) etc.
      '/getMegaMenu.php': {
        target: process.env.VITE_API_PROXY_TARGET || 'https://api.summithomeappliance.com',
        changeOrigin: true,
        secure: true,
      },
      '/products.php': {
        target: process.env.VITE_API_PROXY_TARGET || 'https://api.summithomeappliance.com',
        changeOrigin: true,
        secure: true,
      },
      '/products': {
        target: process.env.VITE_API_PROXY_TARGET || 'https://api.summithomeappliance.com',
        changeOrigin: true,
        secure: true,
      },
      // Image/base path if needed
      '/php_admin_panel': {
        target: process.env.VITE_API_PROXY_TARGET || 'https://api.summithomeappliance.com',
        changeOrigin: true,
        secure: true,
      },
      '/wishlistupload.php': {
        target: process.env.VITE_API_PROXY_TARGET || 'https://api.summithomeappliance.com',
        changeOrigin: true,
        secure: true,
      },
      '/getcatproducts.php': {
        target: process.env.VITE_API_PROXY_TARGET || 'https://api.summithomeappliance.com',
        changeOrigin: true,
        secure: true,
      },
    },
  },
  plugins: [react(), tailwindcss()],
})
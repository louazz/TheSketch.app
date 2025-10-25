import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mkcert from 'vite-plugin-mkcert'
import { VitePWA } from 'vite-plugin-pwa'
// https://vite.dev/config/
export default defineConfig({
server: {
  allowedHosts: true
},
  plugins: [react(),  VitePWA({
   
      manifest: {
  
        includeAssets: ["favicon.ico", "apple-touch-icon.png", "assets/*"],
        name: 'thesketch.app',
        short_name: 'Sketch',
        start_url: '/',
        background_color: '#faf2f1',
        theme_color: '#faf2f1',
        icons: [
          {
            src: 'logo.png',
            sizes: '192x192',
            type: 'image/png"'
          },
          {
            src: 'logo.png',
            sizes: '512x512',
            type: 'image/png"'
          }
        ]
      },
      workbox: {
        // defining cached files formats
        globPatterns: ["**/*.{js,css,html,ico,png,svg,webmanifest}"],
      }
    })],
})

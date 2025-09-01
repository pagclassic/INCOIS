import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['vite.svg'],
      manifest: {
        name: 'INCOIS — Ocean Hazard Reporting',
        short_name: 'INCOIS OHR',
        theme_color: '#0B486B',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/app',
        icons: [
          { src: '/vite.svg', sizes: '192x192', type: 'image/svg+xml' },
        ],
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === 'image' || request.destination === 'style' || request.destination === 'script',
            handler: 'StaleWhileRevalidate',
          },
        ],
      },
    }),
  ],
})

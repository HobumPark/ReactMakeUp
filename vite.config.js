import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    viteStaticCopy({
      targets: [
        {
          src: 'public/_redirects',
          dest: '.', // => dist/_redirects
        }
      ]
    })
  ],
  server: {
    host: true,
    historyApiFallback: true,
    proxy: {
      '/api/v1': {
        target: 'http://makeup-api.herokuapp.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/v1/, '/api/v1'),
      },
    },
  },
})

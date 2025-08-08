import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: [
      'react-leaflet',
      'leaflet',
      'leaflet-draw',
      'react-leaflet-draw',
      '@turf/turf'
    ]
  },
  build: {
    rollupOptions: {
      external: [
        'react-leaflet',
        'leaflet',
        'leaflet-draw',
        'react-leaflet-draw',
        '@turf/turf'
      ]
    }
  },
  server: {
    host: '0.0.0.0',
    port: process.env.PORT || 5173
  }
});

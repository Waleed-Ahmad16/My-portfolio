import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
  },
  build: {
    target: 'es2020',
    minify: 'esbuild',
    cssMinify: 'esbuild',
    cssCodeSplit: true,
    sourcemap: false,
    // Skip measuring gzip size during build — saves ~0.5s per build
    reportCompressedSize: false,
    // Inline assets <8KB (icons, small SVGs don't need a round-trip)
    assetsInlineLimit: 8192,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        // Granular chunking — keeps vendor code out of app entry
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          if (id.includes('framer-motion'))  return 'framer';
          if (id.includes('lucide-react'))   return 'icons';
          if (id.includes('react-dom'))      return 'react-dom';
          if (/[\\/]react[\\/]/.test(id))   return 'react';
          // All remaining node_modules into one vendor chunk
          return 'vendor';
        },
      },
    },
  },
});

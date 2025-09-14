import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';

// Plugin para copiar temas de Prism durante el desarrollo
const copyPrismThemes = () => {
  return {
    name: 'copy-prism-themes',
    configureServer(server) {
      // Middleware para servir temas de prism-themes
      server.middlewares.use('/prism-themes', (req, res, next) => {
        const filePath = path.join(__dirname, 'node_modules/prism-themes/themes', req.url.replace('/prism-themes/', ''));
        if (fs.existsSync(filePath)) {
          res.setHeader('Content-Type', 'text/css');
          fs.createReadStream(filePath).pipe(res);
        } else {
          next();
        }
      });
      
      // Middleware para servir temas core de prismjs
      server.middlewares.use('/prism-core', (req, res, next) => {
        const filePath = path.join(__dirname, 'node_modules/prismjs/themes', req.url.replace('/prism-core/', ''));
        if (fs.existsSync(filePath)) {
          res.setHeader('Content-Type', 'text/css');
          fs.createReadStream(filePath).pipe(res);
        } else {
          next();
        }
      });
    }
  };
};

export default defineConfig({
  plugins: [react(), copyPrismThemes()],
  root: 'src',
  publicDir: '../public',
  // Configuración específica para GitHub Pages
  base: '/docsv1/', // Cambia esto por el nombre de tu repositorio
  define: {
    global: 'globalThis',
    // Inyectar configuración de GitHub Pages
    __GITHUB_PAGES_CONFIG__: JSON.stringify({
      basePath: '/docsv1',
      docsPath: '/docsv1/docs',
      isGitHubPages: true
    })
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    }
  },
  optimizeDeps: {
    include: ['buffer']
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    // Configuración optimizada para GitHub Pages
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'src/index.html')
      },
      output: {
        // Asegurar que los archivos de documentación se copien al build
        assetFileNames: (assetInfo) => {
          // Mantener la estructura de carpetas para archivos de docs
          if (assetInfo.name && assetInfo.name.includes('docs/')) {
            return assetInfo.name;
          }
          return 'assets/[name]-[hash][extname]';
        },
        // Optimización para GitHub Pages
        manualChunks: {
          vendor: ['react', 'react-dom'],
          mermaid: ['mermaid'],
          markdown: ['react-markdown', 'remark-gfm', 'rehype-katex', 'remark-math']
        }
      }
    },
    // Copiar la carpeta docs al directorio de build
    copyPublicDir: true,
    // Configuraciones adicionales para GitHub Pages
    sourcemap: false, // Desactivar sourcemaps para reducir tamaño
    minify: 'terser', // Usar terser para mejor minificación
    terserOptions: {
      compress: {
        drop_console: true, // Remover console.log en producción
        drop_debugger: true
      }
    }
  },
  assetsInclude: ['**/*.md', '**/*.json'],
  server: {
    port: 5173,
    host: '127.0.0.1',
    fs: {
      allow: ['..', '.', '../docs']
    }
  }
});
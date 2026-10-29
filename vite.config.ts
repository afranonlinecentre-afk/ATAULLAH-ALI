import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig, Plugin} from 'vite';

// Plugin to serve APK binaries with correct Content-Disposition attachment headers,
// and return explicit 404 for missing APKs instead of Vite's SPA index.html fallback
const apkDownloadPlugin = (): Plugin => ({
  name: 'apk-download-handler',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      if (req.url && req.url.startsWith('/downloads/')) {
        const urlPath = req.url.split('?')[0];
        const filename = path.basename(urlPath);
        if (filename.includes('..') || !filename.endsWith('.apk')) {
          return next();
        }
        const filePath = path.resolve(__dirname, 'public/downloads', filename);
        if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
          const stat = fs.statSync(filePath);
          res.writeHead(200, {
            'Content-Type': 'application/vnd.android.package-archive',
            'Content-Disposition': `attachment; filename="${filename.includes('admin') ? 'AFRAN_OWNER_ADMIN.apk' : 'AFRAN_ONLINE_CENTRE.apk'}"`,
            'Content-Length': stat.size,
          });
          const stream = fs.createReadStream(filePath);
          stream.pipe(res);
          return;
        } else {
          // Explicit 404 when APK does not exist
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            error: 'APK_NOT_FOUND',
            message: 'Android APK binary not found. Build must be generated before downloading.'
          }));
          return;
        }
      }
      next();
    });
  },
});

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), apkDownloadPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});

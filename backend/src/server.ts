import path from 'path';
import fs from 'fs';
import express from 'express';
import { createApp } from './app.js';
import { ENV } from './config/env.js';
import { isGeminiConfigured } from './config/gemini.js';

export async function startServer(): Promise<void> {
  const app = createApp();
  const PORT = Number(ENV.PORT) || 3000;

  const distPath = path.resolve(process.cwd(), 'dist');
  const hasDist = fs.existsSync(distPath) && fs.existsSync(path.join(distPath, 'index.html'));

  if (ENV.IS_PRODUCTION && hasDist) {
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    // Dynamic import of Vite for development dev server
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🌾 AgriSense AI Full-Stack Server running at http://0.0.0.0:${PORT}`);
    console.log(`🌱 Gemini API available: ${isGeminiConfigured()}`);
    console.log(`📊 Mode: ${ENV.NODE_ENV}`);
  });
}

/**
 * AgriSense AI — Main Application Entry Point
 * Orchestrates backend REST services and Vite frontend middleware
 */

import { startServer } from './backend/src/server.js';

startServer().catch((err) => {
  console.error('Fatal: Failed to start AgriSense AI server:', err);
  process.exit(1);
});

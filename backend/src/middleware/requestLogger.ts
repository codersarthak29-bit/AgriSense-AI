import { Request, Response, NextFunction } from 'express';

export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (req.url.startsWith('/api') || req.url === '/health') {
      console.log(`📡 ${req.method} ${req.url} [${res.statusCode}] - ${duration}ms`);
    }
  });
  next();
}

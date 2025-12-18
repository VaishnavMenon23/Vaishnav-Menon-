import { RequestHandler } from 'express';

const ipMap = new Map<string, { count: number; ts: number }>();
const WINDOW = 60 * 1000; // 1 minute
const LIMIT = 60; // requests per window per IP

export const rateLimit: RequestHandler = (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  const now = Date.now();
  const entry = ipMap.get(ip) || { count: 0, ts: now };
  if (now - entry.ts > WINDOW) {
    entry.count = 0;
    entry.ts = now;
  }
  entry.count += 1;
  ipMap.set(ip, entry);
  if (entry.count > LIMIT) {
    return res.status(429).json({ error: 'Rate limit exceeded' });
  }
  next();
};

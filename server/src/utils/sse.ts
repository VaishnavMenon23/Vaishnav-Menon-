import { Response } from 'express';

export function initSSE(res: Response) {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();
}

export function sseSend(res: Response, event: string, data: any) {
  const payload = typeof data === 'string' ? data : JSON.stringify(data);
  res.write(`event: ${event}\n`);
  res.write(`data: ${payload}\n\n`);
}

export function sseEnd(res: Response) {
  res.write('event: end\n');
  res.write('data: {}\n\n');
  try { res.end(); } catch (e) { /* ignore */ }
}

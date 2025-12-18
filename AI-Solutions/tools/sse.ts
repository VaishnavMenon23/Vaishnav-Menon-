/**
 * SSE (Server-Sent Events) streaming utilities.
 */

export interface ExpressResponse {
  setHeader(name: string, value: string): void;
  flushHeaders?(): void;
  write(data: string): void;
  end(): void;
}

export function initSSE(res: ExpressResponse): void {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();
}

export function sseSend(res: ExpressResponse, event: string, data: any): void {
  const payload = typeof data === 'string' ? data : JSON.stringify(data);
  res.write(`event: ${event}\n`);
  res.write(`data: ${payload}\n\n`);
}

export function sseEnd(res: ExpressResponse): void {
  res.write('event: end\n');
  res.write('data: {}\n\n');
  try {
    res.end();
  } catch (e) {
    // ignore
  }
}

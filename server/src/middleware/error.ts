import { Request, Response, NextFunction } from 'express';

// Error handler must have 4 params (express requirement)
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  console.error(`[ERROR] ${status}: ${message}`, err);
  res.status(status).json({ error: message, ...(process.env.NODE_ENV === 'development' && { details: err.stack }) });
};

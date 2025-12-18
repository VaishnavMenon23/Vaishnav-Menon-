/**
 * Input validation middleware.
 * Sanitizes and validates common input patterns.
 */

import { RequestHandler } from 'express';

export const validateInput: RequestHandler = (req, res, next) => {
  // Sanitize string inputs to prevent XSS
  if (req.body) {
    Object.keys(req.body).forEach((key) => {
      if (typeof req.body[key] === 'string') {
        // Remove potentially dangerous characters
        req.body[key] = req.body[key]
          .replace(/[<>\"']/g, '')
          .trim();
      }
    });
  }
  next();
};

/**
 * Validate request size and rate.
 */
export const validateSize: RequestHandler = (req, res, next) => {
  const maxSize = 1024 * 1024; // 1MB
  const size = JSON.stringify(req.body).length;
  if (size > maxSize) {
    return res.status(413).json({ error: 'Payload too large' });
  }
  next();
};

/**
 * Strict CORS validation.
 */
export function createCorsValidator(allowedOrigins: string[]) {
  return (req: any, res: any, next: any) => {
    const origin = req.headers.origin;
    if (!origin || !allowedOrigins.includes(origin)) {
      return res.status(403).json({ error: 'CORS not allowed' });
    }
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    next();
  };
}

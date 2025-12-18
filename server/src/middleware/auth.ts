import { RequestHandler, Request } from 'express';
import jwt from 'jsonwebtoken';
import jwksRsa from 'jwks-rsa';
import { logger } from '../services/logger';

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

const { AAD_ISSUER, AAD_AUDIENCE } = process.env;

if (!AAD_ISSUER || !AAD_AUDIENCE) {
  throw new Error('Missing AAD_ISSUER or AAD_AUDIENCE in environment');
}

const client = jwksRsa({
  jwksUri: `${AAD_ISSUER}/.well-known/openid-configuration/jwks`
});

function getKey(header: any, callback: any) {
  client.getSigningKey(header.kid, function (err, key) {
    if (err) return callback(err);
    const signingKey = key.getPublicKey();
    callback(null, signingKey);
  });
}

export const requireAuth: RequestHandler = async (req, res, next) => {
  const clientIp = req.ip || req.connection.remoteAddress || 'unknown';
  try {
    const auth = req.headers.authorization;
    if (!auth) {
      logger.warn(`[AUTH] Missing auth header from ${clientIp}`);
      return res.status(401).json({ error: 'Missing authorization header' });
    }
    
    const parts = auth.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      logger.warn(`[AUTH] Invalid auth scheme from ${clientIp}: ${parts[0]}`);
      return res.status(401).json({ error: 'Invalid authorization scheme (use Bearer)' });
    }
    
    const token = parts[1];
    
    // verify token using JWKS
    jwt.verify(token, getKey as any, { audience: AAD_AUDIENCE, issuer: AAD_ISSUER }, (err, decoded: any) => {
      if (err) {
        logger.warn(`[AUTH] Token verification failed from ${clientIp}: ${err.message}`);
        return res.status(401).json({ error: 'Invalid token' });
      }
      req.user = decoded;
      logger.info(`[AUTH] Authenticated user: ${decoded.preferred_username} from ${clientIp}`);
      next();
    });
  } catch (e: any) {
    logger.error(`[AUTH] Unexpected error: ${e.message}`, e);
    return res.status(500).json({ error: 'Authentication failed' });
  }
};

export const requireRole = (role: string) => {
  return (req: any, res: any, next: any) => {
    const roles = req.user?.roles || req.user?.role || [];
    const has = Array.isArray(roles) ? roles.includes(role) : roles === role;
    if (!has) {
      logger.warn(`[AUTH] Access denied: user ${req.user?.preferred_username} lacks ${role} role`);
      return res.status(403).json({ error: `Requires ${role} role` });
    }
    logger.info(`[AUTH] Role check passed: ${req.user?.preferred_username} has ${role}`);
    next();
  };
};

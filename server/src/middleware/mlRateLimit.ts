/**
 * ML Rate Limiting Middleware
 * Per-user rate limiting for ML predictions
 */

import { RequestHandler } from 'express';
import { logger } from '../services/logger';

interface RateLimitConfig {
  rpm: number; // Requests per minute
  burst: number; // Max requests in burst window
  burstWindowMs: number; // Burst window duration
}

interface UserRateLimit {
  count: number;
  resetAt: number;
  burstCount: number;
  burstResetAt: number;
}

const config: RateLimitConfig = {
  rpm: parseInt(process.env.ML_RATE_LIMIT_RPM || '120'),
  burst: 20,
  burstWindowMs: 10 * 1000, // 10 seconds
};

const userLimits = new Map<string, UserRateLimit>();

/**
 * Clean up expired limits
 */
function cleanupExpired(): void {
  const now = Date.now();
  for (const [userId, limit] of userLimits.entries()) {
    if (limit.resetAt < now && limit.burstResetAt < now) {
      userLimits.delete(userId);
    }
  }
}

/**
 * Check rate limit for user
 */
function checkLimit(userId: string): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const minuteMs = 60 * 1000;

  let limit = userLimits.get(userId);

  if (!limit) {
    limit = {
      count: 0,
      resetAt: now + minuteMs,
      burstCount: 0,
      burstResetAt: now + config.burstWindowMs,
    };
    userLimits.set(userId, limit);
  }

  // Reset minute counter
  if (now >= limit.resetAt) {
    limit.count = 0;
    limit.resetAt = now + minuteMs;
  }

  // Reset burst counter
  if (now >= limit.burstResetAt) {
    limit.burstCount = 0;
    limit.burstResetAt = now + config.burstWindowMs;
  }

  // Check limits
  const burstOk = limit.burstCount < config.burst;
  const minuteOk = limit.count < config.rpm;

  if (burstOk && minuteOk) {
    limit.count++;
    limit.burstCount++;
    return {
      allowed: true,
      remaining: config.rpm - limit.count,
      resetAt: limit.resetAt,
    };
  }

  return {
    allowed: false,
    remaining: 0,
    resetAt: limit.resetAt,
  };
}

/**
 * Rate limit middleware for ML predictions
 */
export const mlRateLimit: RequestHandler = (req, res, next) => {
  const userId = (req as any).user?.preferred_username || (req as any).ip || 'unknown';

  const { allowed, remaining, resetAt } = checkLimit(userId);

  // Set rate limit headers
  res.setHeader('X-RateLimit-Limit', config.rpm);
  res.setHeader('X-RateLimit-Remaining', Math.max(remaining, 0));
  res.setHeader('X-RateLimit-Reset', resetAt);

  if (!allowed) {
    logger.warn(`[ML RateLimit] User ${userId} exceeded limit`);
    return res.status(429).json({
      error: 'Rate limit exceeded',
      retryAfter: Math.ceil((resetAt - Date.now()) / 1000),
      limit: config.rpm,
      window: '1 minute',
    });
  }

  // Cleanup periodically
  if (Math.random() < 0.01) {
    cleanupExpired();
  }

  next();
};

/**
 * Reset rate limits (for testing/admin)
 */
export function resetRateLimits(): void {
  userLimits.clear();
  logger.info('[ML RateLimit] All limits reset');
}

export default mlRateLimit;

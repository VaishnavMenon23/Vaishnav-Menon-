/**
 * Standardized AI errors.
 */

export class AIError extends Error {
  constructor(public code: string, message: string, public statusCode = 500) {
    super(message);
    this.name = 'AIError';
  }
}

export class ValidationError extends AIError {
  constructor(message: string) {
    super('VALIDATION_ERROR', message, 400);
    this.name = 'ValidationError';
  }
}

export class ModerationError extends AIError {
  constructor(message: string) {
    super('MODERATION_ERROR', message, 403);
    this.name = 'ModerationError';
  }
}

export class ProviderError extends AIError {
  constructor(provider: string, message: string) {
    super(`PROVIDER_ERROR_${provider.toUpperCase()}`, message, 502);
    this.name = 'ProviderError';
  }
}

export class RateLimitError extends AIError {
  constructor(message = 'Rate limit exceeded') {
    super('RATE_LIMIT_ERROR', message, 429);
    this.name = 'RateLimitError';
  }
}

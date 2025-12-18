const LOG_LEVEL = process.env.LOG_LEVEL || 'info';
const LEVELS = { debug: 0, info: 1, warn: 2, error: 3 };
const level = LEVELS[LOG_LEVEL as keyof typeof LEVELS] ?? 1;

function shouldLog(msgLevel: number) { return msgLevel >= level; }

export const logger = {
  debug: (...args: any[]) => shouldLog(0) && console.debug('[DEBUG]', ...args),
  info: (...args: any[]) => shouldLog(1) && console.info('[INFO]', ...args),
  warn: (...args: any[]) => shouldLog(2) && console.warn('[WARN]', ...args),
  error: (...args: any[]) => shouldLog(3) && console.error('[ERROR]', ...args),
};

export function logInfo(...args: any[]) { logger.info(...args); }
export function logError(...args: any[]) { logger.error(...args); }

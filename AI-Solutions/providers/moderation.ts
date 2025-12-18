/**
 * Moderation provider.
 * Basic safety checks: PII detection, toxicity heuristics, allow/deny lists.
 */

import { ModerationResult } from '../core/types.js';

const TOXICITY_KEYWORDS = [
  'hate', 'kill', 'abuse', 'offensive'
]; // TODO: expand or integrate with Azure Content Safety API

const PII_PATTERNS = [
  /\b\d{3}-\d{2}-\d{4}\b/, // SSN
  /\b\d{16}\b/, // credit card
  /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/ // email (basic)
];

export function checkModeration(text: string): ModerationResult {
  const reasons: string[] = [];

  // Check PII
  for (const pattern of PII_PATTERNS) {
    if (pattern.test(text)) {
      reasons.push('PII_DETECTED');
      break;
    }
  }

  // Check toxicity heuristic
  const lowerText = text.toLowerCase();
  for (const kw of TOXICITY_KEYWORDS) {
    if (lowerText.includes(kw)) {
      reasons.push('TOXIC_KEYWORD');
      break;
    }
  }

  return {
    allowed: reasons.length === 0,
    reasons: reasons.length > 0 ? reasons : undefined
  };
}

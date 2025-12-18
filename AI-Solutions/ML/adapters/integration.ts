/**
 * ML-Chat Integration Layer
 * Integrates ML predictions into the chat pipeline for intent routing and risk scoring
 */

import { logger } from '@services/logger';
import { MLPredictResponse } from '@ml/inference/server/node/schema';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  metadata?: Record<string, any>;
}

export interface RoutedChat {
  shouldSkipLLM: boolean; // If true, return cached answer
  riskLevel: 'low' | 'medium' | 'high';
  intent: string;
  cachedResponse?: string;
  context: Record<string, any>;
}

/**
 * Intent-to-cached-answer mapping (MVP)
 */
const INTENT_CACHE: Record<string, string> = {
  'faq_credentials': 'Your credentials are encrypted with AES-256. Never share them publicly.',
  'faq_security': 'Enable 2FA for better security. Always verify URLs before entering credentials.',
  'faq_portfolio': 'This portfolio showcases AI & Cybersecurity expertise with Azure integration.',
  'greeting': 'Hello! How can I assist you today?',
};

/**
 * Risk scores for intent/class combinations
 */
const RISK_SCORES: Record<string, number> = {
  'phishing': 0.95,
  'malware': 0.90,
  'credential_request': 0.85,
  'urgent_action': 0.70,
  'benign': 0.05,
  'faq': 0.00,
};

/**
 * Route chat based on ML predictions
 */
export async function routeChat(
  userMessage: string,
  mlPrediction: MLPredictResponse
): Promise<RoutedChat> {
  if (mlPrediction.error) {
    logger.warn(`[Integration] ML prediction error: ${mlPrediction.error}`);
    return {
      shouldSkipLLM: false,
      riskLevel: 'medium',
      intent: 'unknown',
      context: { mlError: mlPrediction.error },
    };
  }

  const { result: intent, confidence } = mlPrediction;
  const riskScore = RISK_SCORES[intent] ?? 0.5;

  // Determine risk level
  let riskLevel: 'low' | 'medium' | 'high' = 'low';
  if (riskScore >= 0.8) riskLevel = 'high';
  else if (riskScore >= 0.5) riskLevel = 'medium';

  // Check if we have a cached answer
  const cachedResponse = INTENT_CACHE[intent];
  const shouldSkipLLM = cachedResponse !== undefined && confidence > 0.7;

  logger.info(`[Integration] Routed intent=${intent}, conf=${confidence.toFixed(3)}, risk=${riskLevel}, skipLLM=${shouldSkipLLM}`);

  return {
    shouldSkipLLM,
    riskLevel,
    intent,
    cachedResponse,
    context: {
      mlPrediction: mlPrediction,
      userMessage,
      riskAnnotation: {
        level: riskLevel,
        score: riskScore,
      },
    },
  };
}

/**
 * Augment chat context with ML risk annotation
 * Pass to LLM for risk-aware response generation
 */
export function augmentChatContext(
  messages: ChatMessage[],
  routing: RoutedChat
): ChatMessage[] {
  if (routing.riskLevel === 'high') {
    // Insert system message about risk
    return [
      {
        role: 'system',
        content: `⚠️ ALERT: User message flagged as high-risk (${routing.intent}). Respond cautiously and never ask for credentials.`,
        metadata: { source: 'ml_integration', type: 'risk_annotation' },
      },
      ...messages,
    ];
  }

  return messages;
}

/**
 * Measure token savings from skipped LLM calls
 */
export interface TokenMetrics {
  totalRequests: number;
  skippedByML: number;
  savedTokens: number;
  avgTokensPerRequest: number;
  savingsPercent: number;
}

let metrics: TokenMetrics = {
  totalRequests: 0,
  skippedByML: 0,
  savedTokens: 0,
  avgTokensPerRequest: 150, // Rough estimate
  savingsPercent: 0,
};

/**
 * Record prediction and token savings
 */
export function recordPrediction(routing: RoutedChat): void {
  metrics.totalRequests++;
  if (routing.shouldSkipLLM) {
    metrics.skippedByML++;
    metrics.savedTokens += metrics.avgTokensPerRequest;
  }
  metrics.savingsPercent = (metrics.skippedByML / metrics.totalRequests) * 100;
}

/**
 * Get token savings metrics
 */
export function getTokenMetrics(): TokenMetrics {
  return { ...metrics };
}

/**
 * Reset metrics (for testing)
 */
export function resetMetrics(): void {
  metrics = {
    totalRequests: 0,
    skippedByML: 0,
    savedTokens: 0,
    avgTokensPerRequest: 150,
    savingsPercent: 0,
  };
}

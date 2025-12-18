/**
 * Postprocessing for ML model outputs
 * Converts raw logits to human-readable predictions
 */

/**
 * Apply softmax to logits to get probabilities
 */
export function softmax(logits: number[]): number[] {
  // Numerical stability: subtract max
  const maxLogit = Math.max(...logits);
  const expLogits = logits.map(l => Math.exp(l - maxLogit));
  const sumExp = expLogits.reduce((a, b) => a + b, 0);
  return expLogits.map(e => e / sumExp);
}

/**
 * Get the predicted class and confidence from probabilities
 */
export function getPrediction(
  probs: number[],
  classes: string[]
): { class: string; confidence: number; classIdx: number } {
  let maxProb = -1;
  let maxIdx = -1;

  for (let i = 0; i < probs.length; i++) {
    if (probs[i] > maxProb) {
      maxProb = probs[i];
      maxIdx = i;
    }
  }

  return {
    class: classes[maxIdx] || 'unknown',
    confidence: maxProb,
    classIdx: maxIdx,
  };
}

/**
 * Get all class probabilities as a dictionary
 */
export function getProbsDict(probs: number[], classes: string[]): Record<string, number> {
  const result: Record<string, number> = {};
  for (let i = 0; i < probs.length && i < classes.length; i++) {
    result[classes[i]] = probs[i];
  }
  return result;
}

/**
 * Extract top-K most likely tokens/features for explainability
 * (assumes features are normalized word counts)
 */
export function extractTopTokens(
  features: number[],
  vocab: Map<string, number>,
  topK: number = 5
): string[] {
  const tokenScores: [string, number][] = [];

  // Invert vocab map (idx -> token)
  const idxToToken = new Map<number, string>();
  for (const [token, idx] of vocab.entries()) {
    idxToToken.set(idx, token);
  }

  // Score tokens by feature magnitude
  for (let i = 0; i < features.length; i++) {
    if (features[i] > 0) {
      const token = idxToToken.get(i);
      if (token) {
        tokenScores.push([token, features[i]]);
      }
    }
  }

  // Sort by score and return top-K
  return tokenScores
    .sort((a, b) => b[1] - a[1])
    .slice(0, topK)
    .map(([token]) => token);
}

/**
 * Format prediction result for API response
 */
export function formatPredictionResult(
  modelId: string,
  modelVersion: string,
  inferenceMs: number,
  classes: string[],
  logits: number[],
  features: number[],
  vocab: Map<string, number>
): {
  result: string;
  confidence: number;
  probs: Record<string, number>;
  explainability: { topTokens: string[] };
} {
  const probs = softmax(logits);
  const { class: predictedClass, confidence } = getPrediction(probs, classes);
  const probsDict = getProbsDict(probs, classes);
  const topTokens = extractTopTokens(features, vocab, 5);

  return {
    result: predictedClass,
    confidence,
    probs: probsDict,
    explainability: { topTokens },
  };
}

/**
 * Thresholding: apply confidence threshold to predictions
 */
export function applyThreshold(
  prediction: { class: string; confidence: number },
  threshold: number = 0.5
): { class: string; confidence: number; isConfident: boolean } {
  return {
    ...prediction,
    isConfident: prediction.confidence >= threshold,
  };
}

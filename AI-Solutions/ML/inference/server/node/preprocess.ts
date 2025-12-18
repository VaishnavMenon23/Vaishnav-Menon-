/**
 * Text preprocessing for ML inference
 * Converts raw text input into model-ready features
 */

export interface PreprocessConfig {
  maxTokens: number;
  lowercaseText: boolean;
  stripPunctuation: boolean;
  removeStopwords: boolean;
}

const STOPWORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'is', 'are', 'am', 'be', 'been',
  'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
  'could', 'should', 'can', 'may', 'might', 'must', 'in', 'on', 'at',
  'to', 'for', 'of', 'with', 'from', 'by', 'up', 'about', 'into', 'as'
]);

const PUNCTUATION_PATTERN = /[^\w\s]/g;

/**
 * Basic text cleaning: lowercase, strip punctuation, remove stopwords
 */
export function cleanText(text: string, config: PreprocessConfig): string {
  let cleaned = text;

  // Lowercase
  if (config.lowercaseText) {
    cleaned = cleaned.toLowerCase();
  }

  // Strip punctuation
  if (config.stripPunctuation) {
    cleaned = cleaned.replace(PUNCTUATION_PATTERN, ' ');
  }

  // Remove stopwords
  if (config.removeStopwords) {
    cleaned = cleaned
      .split(/\s+/)
      .filter(token => !STOPWORDS.has(token))
      .join(' ');
  }

  return cleaned.trim();
}

/**
 * Tokenize text into words
 */
export function tokenize(text: string): string[] {
  return text.split(/\s+/).filter(token => token.length > 0);
}

/**
 * Convert tokens to numeric features (bag-of-words style)
 * Returns a sparse vector representation
 */
export function tokensToFeatures(
  tokens: string[],
  vocab: Map<string, number>,
  maxTokens: number
): number[] {
  // Initialize sparse vector
  const features = new Array(vocab.size).fill(0);

  // Count token occurrences
  for (const token of tokens.slice(0, maxTokens)) {
    const idx = vocab.get(token);
    if (idx !== undefined) {
      features[idx]++;
    }
  }

  return features;
}

/**
 * Build a simple vocabulary from tokens
 */
export function buildVocab(texts: string[], maxSize: number = 5000): Map<string, number> {
  const tokenCounts = new Map<string, number>();

  // Count token frequencies
  for (const text of texts) {
    const tokens = tokenize(text);
    for (const token of tokens) {
      tokenCounts.set(token, (tokenCounts.get(token) || 0) + 1);
    }
  }

  // Sort by frequency and keep top maxSize
  const sortedTokens = Array.from(tokenCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxSize);

  const vocab = new Map<string, number>();
  sortedTokens.forEach(([token, _], idx) => {
    vocab.set(token, idx);
  });

  return vocab;
}

/**
 * Main preprocessing pipeline
 * text → clean → tokenize → features
 */
export async function preprocess(
  text: string,
  vocab: Map<string, number>,
  config: PreprocessConfig
): Promise<Float32Array> {
  const cleaned = cleanText(text, config);
  const tokens = tokenize(cleaned);
  const features = tokensToFeatures(tokens, vocab, config.maxTokens);

  // Convert to Float32Array for ONNX
  return new Float32Array(features);
}

/**
 * Compute TF-IDF features (optional, more advanced)
 */
export function computeTfIdf(
  tokens: string[],
  vocab: Map<string, number>,
  idfWeights: Map<string, number>
): Float32Array {
  const features = new Array(vocab.size).fill(0);
  const termFreq = new Map<string, number>();

  // Compute term frequency
  for (const token of tokens) {
    termFreq.set(token, (termFreq.get(token) || 0) + 1);
  }

  // Apply TF-IDF
  for (const [token, tf] of termFreq.entries()) {
    const idx = vocab.get(token);
    if (idx !== undefined) {
      const idf = idfWeights.get(token) || 1;
      features[idx] = (tf / tokens.length) * idf;
    }
  }

  return new Float32Array(features);
}

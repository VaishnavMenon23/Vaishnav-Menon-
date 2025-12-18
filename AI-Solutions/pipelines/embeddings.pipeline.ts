/**
 * Embeddings pipeline.
 * TODO: Chunk texts and call embeddings provider.
 */

import { EmbeddingRequest } from '../core/types.js';
import { AIConfig } from '../core/config.js';

export async function embeddingsPipeline(
  config: AIConfig,
  req: EmbeddingRequest
): Promise<number[][]> {
  // TODO: implement chunking and batching
  console.warn('Embeddings pipeline not yet fully implemented');
  return req.texts.map(() => Array(1536).fill(0));
}

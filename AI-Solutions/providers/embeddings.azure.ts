/**
 * Embeddings provider (stub for future expansion).
 * TODO: Integrate with Azure OpenAI embeddings API.
 */

import { EmbeddingRequest } from '../core/types';
import { AIConfig } from '../core/config';

export async function getEmbeddingsAzure(
  config: AIConfig,
  req: EmbeddingRequest
): Promise<number[][]> {
  // TODO: implement Azure OpenAI embeddings
  console.warn('Embeddings not yet implemented');
  return req.texts.map(() => Array(1536).fill(0));
}

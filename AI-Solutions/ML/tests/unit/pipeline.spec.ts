/**
 * Unit tests for ML pipeline
 */

import MLPipeline from '../../adapters/pipeline';
import { MLPredictResponse } from '../../inference/server/node/schema';

// Mock handler
const mockServerHandler = {
  predict: async (req: any): Promise<MLPredictResponse> => ({
    modelId: 'test-v1',
    modelVersion: '1.0',
    inferenceMs: 42,
    result: 'benign',
    confidence: 0.95,
    probs: { benign: 0.95, phishing: 0.05 },
  }),
  listModels: () => [],
  getModelInfo: () => ({}),
};

describe('MLPipeline', () => {
  let pipeline: MLPipeline;

  beforeEach(() => {
    pipeline = new MLPipeline(mockServerHandler);
  });

  it('should call server handler for predictions', async () => {
    const request = {
      modelId: 'test-v1',
      input: { text: 'Hello, this is a benign message' },
    };

    const response = await pipeline.predict(request);

    expect(response.result).toBe('benign');
    expect(response.confidence).toBe(0.95);
    expect(response.inferenceMs).toBeGreaterThan(0);
  });

  it('should identify confident predictions', async () => {
    const response: MLPredictResponse = {
      modelId: 'test-v1',
      modelVersion: '1.0',
      inferenceMs: 10,
      result: 'phishing',
      confidence: 0.92,
      probs: {},
    };

    expect(pipeline.isConfidentPrediction(response, 0.8)).toBe(true);
    expect(pipeline.isConfidentPrediction(response, 0.95)).toBe(false);
  });

  it('should list models', async () => {
    const models = pipeline.listModels();
    expect(Array.isArray(models)).toBe(true);
  });
});

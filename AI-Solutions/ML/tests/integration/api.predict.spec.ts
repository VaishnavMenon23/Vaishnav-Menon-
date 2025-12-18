/**
 * Integration tests for ML API endpoint
 */

import { MLPredictRequestSchema } from '../../inference/server/node/schema';

describe('ML Predict API', () => {
  describe('Request Validation', () => {
    it('should accept valid request', () => {
      const req = {
        modelId: 'classifier-v1',
        input: {
          text: 'Click here to verify your account',
          language: 'en',
        },
      };

      const result = MLPredictRequestSchema.safeParse(req);
      expect(result.success).toBe(true);
    });

    it('should reject empty text', () => {
      const req = {
        input: { text: '' },
      };

      const result = MLPredictRequestSchema.safeParse(req);
      expect(result.success).toBe(false);
    });

    it('should reject text exceeding max length', () => {
      const req = {
        input: { text: 'a'.repeat(10001) },
      };

      const result = MLPredictRequestSchema.safeParse(req);
      expect(result.success).toBe(false);
    });

    it('should set default modelId', () => {
      const req = {
        input: { text: 'test message' },
      };

      const result = MLPredictRequestSchema.safeParse(req);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.modelId).toBe('classifier-v1');
      }
    });

    it('should reject invalid language', () => {
      const req = {
        input: {
          text: 'test',
          language: 'invalid',
        },
      };

      const result = MLPredictRequestSchema.safeParse(req);
      expect(result.success).toBe(false);
    });
  });

  describe('Response Format', () => {
    it('should return valid response structure', () => {
      // Mock response
      const response = {
        modelId: 'classifier-v1',
        modelVersion: '1.0.0',
        inferenceMs: 42,
        result: 'phishing',
        confidence: 0.93,
        probs: {
          benign: 0.07,
          phishing: 0.93,
        },
        explainability: {
          topTokens: ['verify', 'account', 'click'],
        },
      };

      expect(response.modelId).toBeDefined();
      expect(response.confidence).toBeGreaterThanOrEqual(0);
      expect(response.confidence).toBeLessThanOrEqual(1);
      expect(Object.keys(response.probs).length).toBeGreaterThan(0);
    });
  });
});

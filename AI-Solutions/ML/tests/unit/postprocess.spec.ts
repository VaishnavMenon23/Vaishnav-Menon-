/**
 * Unit tests for postprocessing
 */

import {
  softmax,
  getPrediction,
  getProbsDict,
  extractTopTokens,
  applyThreshold,
} from '../server/node/postprocess';

describe('Postprocessing', () => {
  describe('softmax', () => {
    it('should convert logits to probabilities', () => {
      const logits = [1, 2, 3];
      const probs = softmax(logits);

      expect(probs.length).toBe(3);
      expect(probs.reduce((a, b) => a + b, 0)).toBeCloseTo(1.0, 5);
      expect(probs[2]).toBeGreaterThan(probs[0]); // Highest logit → highest prob
    });

    it('should handle negative logits', () => {
      const logits = [-5, 0, 5];
      const probs = softmax(logits);

      expect(probs.reduce((a, b) => a + b, 0)).toBeCloseTo(1.0, 5);
      expect(probs[2]).toBeGreaterThan(0.9); // Last class dominates
    });
  });

  describe('getPrediction', () => {
    it('should return highest probability class', () => {
      const probs = [0.1, 0.7, 0.2];
      const classes = ['benign', 'phishing', 'suspicious'];
      const pred = getPrediction(probs, classes);

      expect(pred.class).toBe('phishing');
      expect(pred.confidence).toBe(0.7);
      expect(pred.classIdx).toBe(1);
    });
  });

  describe('getProbsDict', () => {
    it('should create class probability map', () => {
      const probs = [0.5, 0.3, 0.2];
      const classes = ['a', 'b', 'c'];
      const dict = getProbsDict(probs, classes);

      expect(dict).toEqual({ a: 0.5, b: 0.3, c: 0.2 });
    });
  });

  describe('applyThreshold', () => {
    it('should mark predictions above threshold as confident', () => {
      const pred = { class: 'phishing', confidence: 0.95 };
      const result = applyThreshold(pred, 0.8);

      expect(result.isConfident).toBe(true);
    });

    it('should mark predictions below threshold as not confident', () => {
      const pred = { class: 'phishing', confidence: 0.6 };
      const result = applyThreshold(pred, 0.8);

      expect(result.isConfident).toBe(false);
    });
  });
});

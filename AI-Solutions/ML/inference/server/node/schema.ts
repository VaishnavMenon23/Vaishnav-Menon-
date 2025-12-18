import { z } from 'zod';

/**
 * Request validation schema for ML prediction API
 */
export const MLPredictRequestSchema = z.object({
  modelId: z.string().default('classifier-v1'),
  input: z.object({
    text: z.string()
      .min(1, 'Text cannot be empty')
      .max(10000, 'Text exceeds max length of 10000 chars'),
    language: z.enum(['en', 'auto']).optional().default('auto'),
    meta: z.record(z.string(), z.unknown()).optional(),
  }),
});

export type MLPredictRequest = z.infer<typeof MLPredictRequestSchema>;

/**
 * Response schema for ML prediction
 */
export const MLPredictResponseSchema = z.object({
  modelId: z.string(),
  modelVersion: z.string(),
  inferenceMs: z.number().min(0),
  result: z.string(), // class label (e.g., 'phishing', 'benign', 'faq')
  confidence: z.number().min(0).max(1),
  probs: z.record(z.string(), z.number()), // all class probabilities
  explainability: z.object({
    topTokens: z.array(z.string()).optional(),
    attention: z.record(z.string(), z.number()).optional(),
  }).optional(),
  error: z.string().optional(),
});

export type MLPredictResponse = z.infer<typeof MLPredictResponseSchema>;

/**
 * Model registry entry
 */
export const ModelRegistryEntrySchema = z.object({
  id: z.string(),
  task: z.string(), // e.g., 'classification'
  framework: z.string(), // 'pytorch', 'tensorflow'
  format: z.enum(['onnx', 'tfjs', 'both']),
  metrics: z.object({
    accuracy: z.number().optional(),
    f1: z.number().optional(),
    precision: z.number().optional(),
    recall: z.number().optional(),
  }),
  version: z.string(),
  exportedAt: z.string().datetime(),
  path: z.object({
    onnx: z.string().optional(),
    tfjs: z.string().optional(),
  }),
  inputShape: z.object({
    maxTokens: z.number(),
    encoding: z.string(), // 'utf-8'
  }),
  classes: z.array(z.string()), // ['phishing', 'benign']
});

export type ModelRegistryEntry = z.infer<typeof ModelRegistryEntrySchema>;

/**
 * Feature extraction configuration
 */
export const FeatureConfigSchema = z.object({
  maxTokens: z.number().default(128),
  vocabSize: z.number().default(5000),
  lowercaseText: z.boolean().default(true),
  stripPunctuation: z.boolean().default(true),
  removeStopwords: z.boolean().default(false),
  ngramRange: z.tuple([z.number(), z.number()]).default([1, 2]),
});

export type FeatureConfig = z.infer<typeof FeatureConfigSchema>;

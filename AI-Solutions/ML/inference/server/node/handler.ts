/**
 * Main ML prediction handler
 * Orchestrates: validation → preprocessing → inference → postprocessing
 */

import { MLPredictRequest, MLPredictResponse, ModelRegistryEntry } from './schema';
import { preprocess } from './preprocess';
import { softmax, getPrediction, getProbsDict, extractTopTokens, formatPredictionResult } from './postprocess';
import { ONNXSessionManager } from './onnxRuntime';
import { logger } from '@services/logger';

export interface MLHandlerConfig {
  modelRegistry: Map<string, ModelRegistryEntry>;
  vocabRegistry: Map<string, Map<string, number>>;
  onnxSessionManager: ONNXSessionManager;
}

export class MLPredictionHandler {
  private config: MLHandlerConfig;

  constructor(config: MLHandlerConfig) {
    this.config = config;
  }

  /**
   * Main prediction endpoint
   */
  async predict(request: MLPredictRequest): Promise<MLPredictResponse> {
    const startTime = Date.now();
    const modelId = request.modelId || 'classifier-v1';

    try {
      // 1. Validate model exists
      const modelEntry = this.config.modelRegistry.get(modelId);
      if (!modelEntry) {
        logger.warn(`[ML] Model not found: ${modelId}`);
        return {
          modelId,
          modelVersion: 'unknown',
          inferenceMs: 0,
          result: 'error',
          confidence: 0,
          probs: {},
          error: `Model ${modelId} not found`,
        };
      }

      // 2. Get vocabulary
      const vocab = this.config.vocabRegistry.get(modelId);
      if (!vocab) {
        throw new Error(`Vocabulary not found for model ${modelId}`);
      }

      // 3. Preprocess input
      const features = await preprocess(
        request.input.text,
        vocab,
        {
          maxTokens: modelEntry.inputShape.maxTokens,
          lowercaseText: true,
          stripPunctuation: true,
          removeStopwords: false,
        }
      );

      // 4. Run inference
      const adapter = await this.config.onnxSessionManager.getAdapter(
        modelId,
        modelEntry.path.onnx || ''
      );

      const outputs = await adapter.run({
        input: {
          name: 'input',
          data: features,
          dims: [1, features.length],
        },
      });

      // 5. Postprocess outputs
      const logitsOutput = outputs['logits'];
      if (!logitsOutput) {
        throw new Error('No logits output from model');
      }

      const logits = Array.from(logitsOutput.data);
      const probs = softmax(logits);
      const { class: predictedClass, confidence } = getPrediction(probs, modelEntry.classes);
      const probsDict = getProbsDict(probs, modelEntry.classes);
      const topTokens = extractTopTokens(Array.from(features), vocab, 5);

      const inferenceMs = Date.now() - startTime;

      const response: MLPredictResponse = {
        modelId,
        modelVersion: modelEntry.version,
        inferenceMs,
        result: predictedClass,
        confidence,
        probs: probsDict,
        explainability: {
          topTokens,
        },
      };

      logger.info(`[ML] Prediction: model=${modelId}, result=${predictedClass}, conf=${confidence.toFixed(3)}, ms=${inferenceMs}`);
      return response;
    } catch (error: any) {
      const inferenceMs = Date.now() - startTime;
      logger.error(`[ML] Prediction error: ${error.message}`);
      return {
        modelId,
        modelVersion: 'unknown',
        inferenceMs,
        result: 'error',
        confidence: 0,
        probs: {},
        error: `Inference failed: ${error.message}`,
      };
    }
  }

  /**
   * Batch prediction for testing/benchmarking
   */
  async predictBatch(requests: MLPredictRequest[]): Promise<MLPredictResponse[]> {
    return Promise.all(requests.map(req => this.predict(req)));
  }

  /**
   * Get model info
   */
  getModelInfo(modelId: string): ModelRegistryEntry | undefined {
    return this.config.modelRegistry.get(modelId);
  }

  /**
   * List all available models
   */
  listModels(): ModelRegistryEntry[] {
    return Array.from(this.config.modelRegistry.values());
  }
}

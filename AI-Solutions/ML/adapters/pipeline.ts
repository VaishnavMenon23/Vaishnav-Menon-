/**
 * ML Pipeline Adapter - Unified interface for ML predictions
 * Chooses between server (ONNX) and client (TF.js) inference
 */

import { MLPredictRequest, MLPredictResponse } from '@ml/inference/server/node/schema';
import { logger } from '@services/logger';

export interface PipelineConfig {
  preferClient: boolean; // If true, try TF.js first; fallback to ONNX
  enableExplainability: boolean;
  confidenceThreshold: number;
}

/**
 * Wrapper for unified prediction API
 */
export class MLPipeline {
  private config: PipelineConfig;
  private serverHandler: any; // MLPredictionHandler instance
  private clientHandler: any; // Optional TF.js handler

  constructor(serverHandler: any, clientHandler?: any, config?: Partial<PipelineConfig>) {
    this.serverHandler = serverHandler;
    this.clientHandler = clientHandler;
    this.config = {
      preferClient: false,
      enableExplainability: true,
      confidenceThreshold: 0.5,
      ...config,
    };
  }

  /**
   * Main predict method
   */
  async predict(request: MLPredictRequest): Promise<MLPredictResponse> {
    try {
      // Try server-side (ONNX) by default
      if (this.serverHandler) {
        const response = await this.serverHandler.predict(request);
        if (!response.error) {
          logger.info(`[ML Pipeline] Server inference successful for model ${request.modelId}`);
          return response;
        }
      }

      // Fallback: client-side TF.js (if available)
      if (this.clientHandler && this.config.preferClient) {
        logger.info(`[ML Pipeline] Falling back to client inference`);
        return await this.clientHandler.predict(request);
      }

      throw new Error('No ML handler available');
    } catch (error: any) {
      logger.error(`[ML Pipeline] Prediction failed: ${error.message}`);
      return {
        modelId: request.modelId || 'unknown',
        modelVersion: 'unknown',
        inferenceMs: 0,
        result: 'error',
        confidence: 0,
        probs: {},
        error: error.message,
      };
    }
  }

  /**
   * Batch predictions
   */
  async predictBatch(requests: MLPredictRequest[]): Promise<MLPredictResponse[]> {
    return Promise.all(requests.map(req => this.predict(req)));
  }

  /**
   * Get model info
   */
  getModelInfo(modelId: string) {
    if (this.serverHandler) {
      return this.serverHandler.getModelInfo(modelId);
    }
    return undefined;
  }

  /**
   * List all models
   */
  listModels() {
    if (this.serverHandler) {
      return this.serverHandler.listModels();
    }
    return [];
  }

  /**
   * Check if prediction meets confidence threshold
   */
  isConfidentPrediction(response: MLPredictResponse, threshold?: number): boolean {
    const th = threshold ?? this.config.confidenceThreshold;
    return response.confidence >= th && !response.error;
  }
}

export default MLPipeline;

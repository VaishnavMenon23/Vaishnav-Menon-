/**
 * ML Prediction API Route
 * POST /api/ml/predict - Single prediction
 * GET /api/ml/models - List models
 */

import { Router, RequestHandler } from 'express';
import { MLPredictRequestSchema } from '@ml/inference/server/node/schema';
import { MLPredictionHandler } from '@ml/inference/server/node/handler';
import { MLPipeline } from '@ml/adapters/pipeline';
import { requireAuth } from '../middleware/auth';
import { mlRateLimit } from '../middleware/mlRateLimit';
import { logger } from '../services/logger';

const router = Router();

// Global ML handler (initialize at startup)
let mlHandler: MLPredictionHandler | null = null;
let mlPipeline: MLPipeline | null = null;

/**
 * Initialize ML handler (call once at server startup)
 */
export async function initializeMLHandler(handler: MLPredictionHandler, pipeline: MLPipeline): Promise<void> {
  mlHandler = handler;
  mlPipeline = pipeline;
  logger.info('[ML Route] ML handler initialized');
}

/**
 * POST /api/ml/predict
 * Predict using ML model
 */
const predictHandler: RequestHandler = async (req, res, next) => {
  try {
    // Validate request
    const result = MLPredictRequestSchema.safeParse(req.body);
    if (!result.success) {
      logger.warn(`[ML Route] Validation error: ${JSON.stringify(result.error.issues)}`);
      return res.status(400).json({
        error: 'Invalid request',
        details: result.error.issues,
      });
    }

    const request = result.data;

    // Run prediction
    if (!mlPipeline) {
      logger.error('[ML Route] ML pipeline not initialized');
      return res.status(500).json({ error: 'ML service not available' });
    }

    const prediction = await mlPipeline.predict(request);

    // Log for auditing
    const userId = (req as any).user?.preferred_username || 'unknown';
    logger.info(`[ML Route] Prediction: userId=${userId}, modelId=${request.modelId}, result=${prediction.result}`);

    return res.json(prediction);
  } catch (error: any) {
    logger.error(`[ML Route] Prediction error: ${error.message}`);
    return res.status(500).json({ error: 'Prediction failed' });
  }
};

/**
 * GET /api/ml/models
 * List available models
 */
const listModelsHandler: RequestHandler = async (req, res) => {
  try {
    if (!mlPipeline) {
      return res.status(500).json({ error: 'ML service not available' });
    }

    const models = mlPipeline.listModels();
    return res.json({ models });
  } catch (error: any) {
    logger.error(`[ML Route] List models error: ${error.message}`);
    return res.status(500).json({ error: 'Failed to list models' });
  }
};

/**
 * GET /api/ml/models/:modelId
 * Get model info
 */
const getModelHandler: RequestHandler = async (req, res) => {
  try {
    const { modelId } = req.params;

    if (!mlPipeline) {
      return res.status(500).json({ error: 'ML service not available' });
    }

    const modelInfo = mlPipeline.getModelInfo(modelId);
    if (!modelInfo) {
      return res.status(404).json({ error: `Model ${modelId} not found` });
    }

    return res.json(modelInfo);
  } catch (error: any) {
    logger.error(`[ML Route] Get model error: ${error.message}`);
    return res.status(500).json({ error: 'Failed to get model info' });
  }
};

// Mount routes with middleware
router.post('/predict', requireAuth, mlRateLimit, predictHandler);
router.get('/models', requireAuth, listModelsHandler);
router.get('/models/:modelId', requireAuth, getModelHandler);

export default router;

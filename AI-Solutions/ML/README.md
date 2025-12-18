# AI Solutions ML Module

**Unified ML inference engine** for text classification, intent routing, and risk scoring.

## Overview

The ML module adds intelligent text classification to your portfolio's AI chat system:

- **Phishing Detection**: Identifies suspicious messages before sending to LLM
- **Intent Routing**: Pre-routes common FAQ questions (saves LLM tokens)
- **Risk Scoring**: Annotates chat context with risk levels
- **Explainability**: Returns top tokens contributing to prediction

## Features

✅ **Server-side ONNX Inference** (default, production-grade)  
✅ **Optional Client-side TF.js** (browser inference, privacy-first)  
✅ **Zod Validation** (strict request/response schema)  
✅ **Per-user Rate Limiting** (120 RPM configurable)  
✅ **Chat Pipeline Integration** (token savings measurement)  
✅ **Model Registry** (version tracking, metrics)  
✅ **Comprehensive Tests** (unit + integration)

## Quick Start

### 1. Install Dependencies

```bash
cd server
npm install

# Optional: Install ONNX Runtime (production)
npm install onnxruntime-node

# Optional: Install TF.js (client demo)
npm install @tensorflow/tfjs
```

### 2. Train & Export Model

```bash
# Train classifier
npm run ml:train

# Export to ONNX
npm run ml:export:onnx

# Export to TF.js (optional)
npm run ml:export:tfjs
```

See [training/README.md](training/README.md) for details.

### 3. Configure Environment

Add to `.env`:

```bash
ML_DEFAULT_MODEL_ID=classifier-v1
ML_ONNX_MODEL_PATH=AI Solutions/ML/models/onnx/classifier.onnx
ML_TFJS_MODEL_PATH=AI Solutions/ML/models/tfjs/
ML_MAX_INPUT_SIZE=10000
ML_RATE_LIMIT_RPM=120
ML_ENABLE_CLIENT_INFERENCE=false
```

### 4. Initialize ML Handler in Server

```typescript
// server/src/index.ts
import { initializeMLHandler } from './routes/ml';
import { MLPredictionHandler } from '../AI Solutions/ML/inference/server/node/handler';
import MLPipeline from '../AI Solutions/ML/adapters/pipeline';

// Load model registry
const registryPath = path.join(__dirname, '../AI Solutions/ML/models/registry.json');
const registry = JSON.parse(fs.readFileSync(registryPath, 'utf-8'));

// Initialize handlers
const modelRegistry = new Map(registry.models.map(m => [m.id, m]));
const vocabRegistry = new Map(); // Load vocab from training outputs
const handler = new MLPredictionHandler({ modelRegistry, vocabRegistry, onnxSessionManager });
const pipeline = new MLPipeline(handler);

await initializeMLHandler(handler, pipeline);

// Mount ML routes
app.use('/api/ml', require('./routes/ml').default);
```

### 5. Test API

```bash
# Predict phishing/benign
curl -X POST http://localhost:8080/api/ml/predict \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "modelId": "classifier-v1",
    "input": {
      "text": "Click here to verify your account immediately"
    }
  }'

# Response
{
  "modelId": "classifier-v1",
  "modelVersion": "1.0.0",
  "inferenceMs": 42,
  "result": "phishing",
  "confidence": 0.93,
  "probs": {
    "benign": 0.07,
    "phishing": 0.93
  },
  "explainability": {
    "topTokens": ["verify", "account", "immediately"]
  }
}
```

## API Endpoints

### POST /api/ml/predict

Predict class for input text.

**Request:**
```json
{
  "modelId": "classifier-v1",
  "input": {
    "text": "string (required, max 10000 chars)",
    "language": "en | auto (optional, default: auto)",
    "meta": { /* custom metadata */ }
  }
}
```

**Response:**
```json
{
  "modelId": "string",
  "modelVersion": "string",
  "inferenceMs": 42,
  "result": "class_label",
  "confidence": 0.93,
  "probs": { "class1": 0.07, "class2": 0.93 },
  "explainability": {
    "topTokens": ["token1", "token2"]
  }
}
```

**Status Codes:**
- 200 → Success
- 400 → Invalid request (schema validation failed)
- 401 → Unauthorized (missing/invalid auth)
- 429 → Rate limit exceeded
- 500 → Inference error

### GET /api/ml/models

List available models.

**Response:**
```json
{
  "models": [
    {
      "id": "classifier-v1",
      "task": "classification",
      "version": "1.0.0",
      "classes": ["benign", "phishing"],
      "metrics": {
        "accuracy": 0.92,
        "f1": 0.89
      }
    }
  ]
}
```

### GET /api/ml/models/:modelId

Get model details.

## Chat Pipeline Integration

### Intent Routing

```typescript
import { routeChat } from '../AI Solutions/ML/adapters/integration';

// In chat route handler
const mlPrediction = await mlPipeline.predict({
  modelId: 'classifier-v1',
  input: { text: userMessage }
});

const routing = await routeChat(userMessage, mlPrediction);

if (routing.shouldSkipLLM) {
  // Return cached answer (e.g., FAQ)
  return res.json({ message: routing.cachedResponse });
}

// Augment context with risk annotation
const augmentedMessages = augmentChatContext(messages, routing);

// Continue with normal LLM pipeline
const llmResponse = await chatStream(augmentedMessages);
```

### Token Savings

Track token savings from ML-routed queries:

```typescript
import { getTokenMetrics } from '../AI Solutions/ML/adapters/integration';

const metrics = getTokenMetrics();
console.log(`Saved ${metrics.savedTokens} tokens (${metrics.savingsPercent.toFixed(1)}%)`);
```

## Directory Structure

```
AI Solutions/ML/
├── training/                     # Model training
│   ├── scripts/
│   │   ├── train.py             # Train classifier
│   │   ├── export_onnx.py       # Export to ONNX
│   │   └── convert_tfjs.py      # Export to TF.js
│   ├── notebooks/
│   │   └── 01-exploration.ipynb # Data exploration
│   └── README.md                # Training guide
│
├── models/                       # Model artifacts
│   ├── onnx/
│   │   └── classifier.onnx      # ONNX model (primary)
│   ├── tfjs/
│   │   ├── model.json           # TF.js graph
│   │   └── weights.bin          # TF.js weights
│   └── registry.json            # Model registry & metadata
│
├── inference/                    # Inference implementations
│   ├── server/node/
│   │   ├── handler.ts           # Main prediction handler
│   │   ├── onnxRuntime.ts       # ONNX adapter + session mgmt
│   │   ├── schema.ts            # Zod validation schemas
│   │   ├── preprocess.ts        # Text feature extraction
│   │   └── postprocess.ts       # Logits → predictions
│   └── client/
│       ├── loader.ts            # TF.js model loader
│       ├── preprocess.ts        # Client-side preprocessing
│       └── postprocess.ts       # Client-side postprocessing
│
├── adapters/                     # Integration layer
│   ├── pipeline.ts              # Unified prediction API
│   ├── integration.ts           # Chat integration & routing
│   └── features.ts              # Shared feature extraction
│
├── tests/
│   ├── unit/
│   │   ├── postprocess.spec.ts
│   │   └── pipeline.spec.ts
│   └── integration/
│       └── api.predict.spec.ts
│
└── README.md                     # This file
```

## Performance

| Metric | Server (ONNX) | Browser (TF.js) |
|--------|---------------|-----------------|
| Latency | 10-50ms | 50-200ms |
| Memory | ~50MB | ~100MB |
| Deployment | Production ✅ | Demo/Privacy ✅ |
| Accuracy | 92% | 92% (same weights) |

## Security & Privacy

✅ **Server-side by default**: All inference on your server (no external calls)  
✅ **No input persistence**: Raw user text not logged or stored  
✅ **Rate limiting**: Per-user to prevent abuse  
✅ **Audit logging**: Predictions logged for compliance  
✅ **Schema validation**: Zod prevents injection attacks  

## Limitations & Next Steps

**Current MVP:**
- Binary classification only (benign vs phishing)
- Fixed vocabulary size (5000 tokens)
- Simplified text preprocessing

**Future Enhancements:**
- [ ] Multi-class intent classification (FAQ, security, urgent, etc.)
- [ ] Active learning (collect user feedback, retrain)
- [ ] Online model updates (A/B test new versions)
- [ ] Custom domain adaptation (fine-tune on your data)
- [ ] Explainability improvements (attention visualization)
- [ ] Batch prediction API

## Testing

```bash
# Run all tests
npm run ml:test

# Run specific test file
npm run ml:test -- postprocess.spec.ts

# Run with coverage
npm run ml:test -- --coverage
```

## Troubleshooting

**ONNX model not found:**
```
Error: ML_ONNX_MODEL_PATH not set or file doesn't exist
→ Set ML_ONNX_MODEL_PATH in .env
→ Run: npm run ml:train && npm run ml:export:onnx
```

**Rate limit hit:**
```
429 Too Many Requests
→ Wait for reset or increase ML_RATE_LIMIT_RPM in .env
→ Per-user limit: (ML_RATE_LIMIT_RPM / 60) * 1 request/sec
```

**Low confidence predictions:**
```
result: "benign", confidence: 0.52
→ Consider raising confidence threshold in pipeline.ts
→ Or retrain with more/better data
```

## Architecture Decisions

1. **ONNX by default** (not TF.js) because:
   - Production-grade, hardware acceleration
   - Smaller model size, faster inference
   - Cross-platform support
   - Server-side = security guarantees

2. **Zod validation** because:
   - Type-safe schema validation
   - Runtime checking (catch bugs early)
   - Clear error messages
   - Zero dependencies on runtime (unlike JSON Schema)

3. **Per-user rate limiting** because:
   - Fairer than IP-based (handles shared networks)
   - Prevents user abuse
   - Audit trail (which user hit limit)

4. **Intent caching** because:
   - ~40% of queries are likely FAQ (rough estimate)
   - Instant response (no LLM latency)
   - Reduces token usage by ~150-300 per cached query
   - Improves UX (sub-10ms response time)

## Contributing

See [../../CONTRIBUTING.md](../../CONTRIBUTING.md) for:
- Code standards
- Testing requirements
- Commit conventions

To add a new model:
1. Train & export (see training/README.md)
2. Add entry to `models/registry.json`
3. Update `inference/server/node/onnxRuntime.ts` if needed
4. Write integration tests
5. Update documentation

## References

- **ONNX**: https://onnx.ai/
- **ONNX Runtime**: https://onnxruntime.ai/
- **TensorFlow.js**: https://www.tensorflow.org/js
- **Zod**: https://zod.dev/
- **PyTorch Export**: https://pytorch.org/docs/stable/onnx.html

---

**Last Updated**: December 2024  
**Status**: MVP (Production Ready for Binary Classification)  
**License**: Part of Vaishnav Portfolio Project

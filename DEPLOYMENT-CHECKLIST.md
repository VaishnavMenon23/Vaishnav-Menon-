# 🚀 Deployment Checklist - ML Module + Portfolio

## Pre-Deployment (1 hour)

### Environment Setup
- [ ] Verify `.env.vai` exists in root
- [ ] Verify all Azure credentials are in `.env.vai`
  ```bash
  grep -E "AZURE_|ML_" .env.vai
  ```
- [ ] Update `.gitignore` to exclude `.env.vai`
  ```
  .env.vai
  .env
  .env.local
  ```
- [ ] Verify `node_modules` is in `.gitignore`

### Dependencies
- [ ] Run `npm install` in root
- [ ] Run `npm install` in server/ folder
- [ ] Verify installation: `npm list | grep -E "onnx|zod|express"`

### ONNX Runtime Installation
```bash
npm install onnxruntime-node

# Verify installation
npm list onnxruntime-node

# Expected output: onnxruntime-node@1.x.x
```

### Build Verification
```bash
# Frontend
npm run build

# Backend
cd server && npm run build

# ML Type Check
npm run ml:typecheck
```

Expected: Zero errors

---

## ML Model Setup (30 minutes)

### Train ML Model
```bash
# Step 1: Install Python dependencies (if not already installed)
pip install torch numpy pandas scikit-learn onnx

# Step 2: Run training
npm run ml:train

# Expected output:
# ✓ Training complete
# ✓ Saved: AI Solutions/ML/training/artifacts/vocab.json
# ✓ Saved: AI Solutions/ML/training/artifacts/idf_weights.json
# ✓ Saved: AI Solutions/ML/training/artifacts/metadata.json
```

### Export to ONNX
```bash
# Step 3: Export model
npm run ml:export:onnx

# Expected output:
# ✓ ONNX export complete
# ✓ Created: AI Solutions/ML/models/onnx/classifier.onnx
# ✓ Manifest: AI Solutions/ML/models/onnx/classifier.manifest.json
```

### Verify Model Files
```bash
# Check ONNX model exists
ls -lh "AI Solutions/ML/models/onnx/classifier.onnx"

# Check model registry
cat "AI Solutions/ML/models/registry.json" | jq .

# Expected: { "id": "classifier-v1", "task": "classification", ... }
```

### Optional: Export to TF.js (for browser demo)
```bash
npm run ml:export:tfjs

# Creates: AI Solutions/ML/models/tfjs/model.json + weights.bin
```

---

## Backend Server Setup (30 minutes)

### Update server/src/index.ts

Add ML handler initialization:

```typescript
import MLPredictionHandler from '../AI Solutions/ML/inference/server/node/handler';
import MLPipeline from '../AI Solutions/ML/adapters/pipeline';
import mlRoutes from './routes/ml';

// After Express app creation
const modelRegistry = require('../AI Solutions/ML/models/registry.json');

const mlHandler = new MLPredictionHandler({
  modelRegistry,
  confidence_threshold: parseFloat(process.env.ML_CONFIDENCE_THRESHOLD || '0.7'),
  onnx_model_path: process.env.ML_ONNX_MODEL_PATH,
});

const mlPipeline = new MLPipeline(mlHandler);

// Mount ML routes with rate limiting
app.use('/api/ml', mlRateLimit, mlRoutes);

// Make MLPipeline accessible globally
global.mlPipeline = mlPipeline;
```

### Chat Route Integration (Optional)

In your chat route handler:

```typescript
import { routeChat } from '../AI Solutions/ML/adapters/integration';

app.post('/api/chat', authenticate, async (req, res) => {
  const { message } = req.body;

  try {
    // Route through ML first
    const mlPrediction = await mlPipeline.predict({
      modelId: 'classifier-v1',
      input: { text: message }
    });

    const routing = await routeChat(message, mlPrediction);

    // Check for cached answer
    if (routing.shouldSkipLLM && routing.cachedResponse) {
      return res.json({
        message: routing.cachedResponse,
        source: 'ml_cache',
        intent: routing.intent,
        riskLevel: routing.riskLevel,
        confidence: mlPrediction.confidence
      });
    }

    // Continue with LLM...
    // (your existing LLM code here)

  } catch (error) {
    logger.error('Chat route error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
```

### Verify Server Runs

```bash
# Start development server
npm run dev

# Expected output:
# [Express] Server running on port 8080
# [ML] Handler initialized
# [ML] Model 'classifier-v1' loaded

# In another terminal, test ML endpoint:
curl -X POST http://localhost:8080/api/ml/predict \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer test-token" \
  -d '{
    "modelId": "classifier-v1",
    "input": {"text": "Click here to verify account"}
  }'

# Expected response:
# {
#   "modelId": "classifier-v1",
#   "modelVersion": "1.0.0",
#   "inferenceMs": 25,
#   "result": "phishing",
#   "confidence": 0.92,
#   "probs": {"benign": 0.08, "phishing": 0.92},
#   "explainability": {"topTokens": ["verify", "click", "account"]}
# }
```

---

## Testing (15 minutes)

### Run ML Tests
```bash
npm run ml:test

# Expected output:
# PASS  AI Solutions/ML/tests/unit/postprocess.spec.ts
# PASS  AI Solutions/ML/tests/unit/pipeline.spec.ts
# PASS  AI Solutions/ML/tests/integration/api.predict.spec.ts
#
# Test Suites: 3 passed, 3 total
# Tests:       20 passed, 20 total
# Snapshots:   0 total
# Time:        5.234 s
```

### Manual API Tests

**Test 1: Phishing Detection**
```bash
curl -X POST http://localhost:8080/api/ml/predict \
  -H "Authorization: Bearer valid-token" \
  -H "Content-Type: application/json" \
  -d '{
    "modelId": "classifier-v1",
    "input": {"text": "URGENT: Your account has been compromised. Click here immediately"}
  }'

# Expected: result = "phishing", confidence >= 0.85
```

**Test 2: Benign Text**
```bash
curl -X POST http://localhost:8080/api/ml/predict \
  -H "Authorization: Bearer valid-token" \
  -H "Content-Type: application/json" \
  -d '{
    "modelId": "classifier-v1",
    "input": {"text": "What are your business hours?"}
  }'

# Expected: result = "benign", confidence >= 0.80
```

**Test 3: Rate Limiting**
```bash
# Make 121 requests (exceeds 120 RPM limit)
for i in {1..121}; do
  curl -s -X POST http://localhost:8080/api/ml/predict \
    -H "Authorization: Bearer valid-token" \
    -H "Content-Type: application/json" \
    -d "{\"modelId\": \"classifier-v1\", \"input\": {\"text\": \"Test $i\"}}"
done

# Request 121 should return HTTP 429
# Headers should include: Retry-After: 60
```

**Test 4: Auth Failure**
```bash
curl -X POST http://localhost:8080/api/ml/predict \
  -H "Authorization: Bearer invalid-token" \
  -H "Content-Type: application/json" \
  -d '{"modelId": "classifier-v1", "input": {"text": "test"}}'

# Expected: HTTP 401 Unauthorized
```

**Test 5: Invalid Input**
```bash
curl -X POST http://localhost:8080/api/ml/predict \
  -H "Authorization: Bearer valid-token" \
  -H "Content-Type: application/json" \
  -d '{"modelId": "classifier-v1"}'

# Expected: HTTP 400 Bad Request
# Message: "Validation error: input is required"
```

### Test Model Endpoints
```bash
# List all models
curl -X GET http://localhost:8080/api/ml/models \
  -H "Authorization: Bearer valid-token"

# Expected: [{"id": "classifier-v1", ...}]

# Get specific model
curl -X GET http://localhost:8080/api/ml/models/classifier-v1 \
  -H "Authorization: Bearer valid-token"

# Expected: Full model metadata
```

---

## Frontend Integration (15 minutes)

### Add ML Component to App.tsx

```typescript
import MLPredictionsPanel from './components/MLPredictionsPanel';

export const App = () => {
  return (
    <main>
      {/* ... existing sections ... */}
      
      {/* ML Predictions Demo Section */}
      <section id="ml-demo" className="py-16 bg-gray-50 dark:bg-slate-800">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">🤖 ML Classification Demo</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Try out the text classification model below
          </p>
          <MLPredictionsPanel />
        </div>
      </section>
      
      {/* ... rest of app ... */}
    </main>
  );
};
```

### Verify Frontend Build
```bash
npm run build

# Expected: Vite build output with zero errors
# Expected bundle size: ~100 KB gzipped (total)
```

---

## Security Verification

### CORS Check
```bash
curl -X OPTIONS http://localhost:8080/api/ml/predict \
  -H "Origin: http://localhost:5173"

# Expected: Access-Control-Allow-Origin header present
# Expected: Allow header present with POST
```

### Security Headers
```bash
curl -I http://localhost:8080

# Expected headers:
# X-Content-Type-Options: nosniff
# X-Frame-Options: DENY
# X-XSS-Protection: 1; mode=block
```

### Rate Limit Headers
```bash
curl -I -X POST http://localhost:8080/api/ml/predict \
  -H "Authorization: Bearer valid-token" \
  -H "Content-Type: application/json" \
  -d '{"modelId": "classifier-v1", "input": {"text": "test"}}'

# Expected headers:
# X-RateLimit-Limit: 120
# X-RateLimit-Remaining: 119
# X-RateLimit-Reset: <unix-timestamp>
```

---

## Performance Verification

### Latency Test
```bash
time curl -X POST http://localhost:8080/api/ml/predict \
  -H "Authorization: Bearer valid-token" \
  -H "Content-Type: application/json" \
  -d '{"modelId": "classifier-v1", "input": {"text": "Test text for inference"}}'

# Expected: real 0.1-0.2s (includes network latency)
# Response should show: "inferenceMs": 10-50
```

### Memory Usage
```bash
# Check process memory
ps aux | grep node

# Expected: <200 MB (reasonable for production)

# In Chrome DevTools (Frontend)
# Expected: <50 MB for React app
```

### Build Size
```bash
# Frontend
npm run build

# Check dist/ size
du -sh dist/

# Expected: ~150-200 KB total (gzipped ~40-50 KB)

# Backend
cd server && npm run build

# Check dist/ size
du -sh dist/

# Expected: ~200-300 KB (gzipped ~50-70 KB)
```

---

## Documentation Verification

- [ ] README.md is up-to-date
- [ ] QUICKSTART-ML.md is accurate
- [ ] ML-ARCHITECTURE.md reflects actual implementation
- [ ] BACKEND-SETUP.md has correct instructions
- [ ] API examples in docs are tested and work
- [ ] Environment variable list is complete

### Verify Links
```bash
# Check all markdown links
grep -r "](.*)" *.md | grep -v "^#" | head -20

# All links should be valid relative paths
```

---

## Production Deployment

### Pre-Flight Checklist
- [ ] All tests passing (`npm run ml:test`)
- [ ] No TypeScript errors (`npm run ml:typecheck`)
- [ ] No console.logs in production code
- [ ] Security headers enabled
- [ ] Rate limiting enabled
- [ ] Auth required on all API endpoints
- [ ] Error logging configured
- [ ] Models exported and in correct path
- [ ] Environment variables set in deployment
- [ ] ONNX Runtime package installed

### Deployment Steps

**Option 1: Azure App Service**
```bash
# 1. Create app service
az webapp create --resource-group myGroup --plan myPlan --name myApp

# 2. Deploy frontend (Static Web Apps)
az staticwebapp create --resource-group myGroup --name myStatic --source ./

# 3. Deploy backend (App Service)
git push azure main

# 4. Set environment variables
az webapp config appsettings set --resource-group myGroup \
  --name myApp \
  --settings @.env.vai
```

**Option 2: Docker Deployment**
```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 8080
CMD ["npm", "start"]
```

**Option 3: GitHub Pages + Vercel**
```bash
# Frontend to GitHub Pages
npm run build
gh-pages --dist dist

# Backend to Vercel
vercel deploy --prod
```

---

## Post-Deployment Monitoring

### Health Check
```bash
curl https://your-deployment/health

# Expected: {"status": "ok", "timestamp": "..."}
```

### ML Endpoint Monitoring
```bash
# Test endpoint availability
curl https://your-deployment/api/ml/models

# Monitor response time and error rates
# Set up alerts for:
# - HTTP 429 rate (should be rare)
# - HTTP 500 errors (should be 0)
# - Response time > 100ms (investigate)
# - Model loading failures
```

### Logs
```bash
# View application logs
az webapp log tail --resource-group myGroup --name myApp

# Search for ML errors
grep "error" logs.txt | grep -i ml
```

---

## Rollback Plan

If deployment fails:

```bash
# Step 1: Identify issue
# - Check logs
# - Verify environment variables
# - Test local instance

# Step 2: Fix and redeploy
git revert <bad-commit>
npm run build
# Deploy again

# Step 3: Roll back if needed
az webapp deployment slot swap --resource-group myGroup --name myApp
```

---

## Success Criteria

✅ Deployment is successful when:

- [x] Frontend loads without errors
- [x] Backend server starts and listens on port 8080
- [x] `/api/ml/predict` responds with correct predictions
- [x] Rate limiting prevents excessive requests
- [x] Authentication is enforced
- [x] No errors in application logs
- [x] Response times are < 100ms
- [x] MLPredictionsPanel displays correctly
- [x] Dark mode toggle works
- [x] All portfolio data loads

---

## Support & Debugging

### Common Issues

**Issue**: "ONNX module not found"
```bash
# Solution
npm install onnxruntime-node
npm rebuild
```

**Issue**: "Model not found"
```bash
# Solution: Verify path
ls -la "AI Solutions/ML/models/onnx/classifier.onnx"
# Update ML_ONNX_MODEL_PATH in .env.vai
```

**Issue**: "Rate limit errors"
```bash
# Solution: Increase rate limit
ML_RATE_LIMIT_RPM=300

# Or use different user tokens
```

**Issue**: "Slow inference"
```bash
# Solution: Check CPU usage
top -p <backend-pid>

# May need more resources or GPU
```

### Support Resources

- 📖 [ML/README.md](AI%20Solutions/ML/README.md) - Full ML documentation
- 🚀 [QUICKSTART-ML.md](QUICKSTART-ML.md) - Quick reference
- 🏗️ [ML-ARCHITECTURE.md](ML-ARCHITECTURE.md) - Architecture diagrams
- 🔧 [BACKEND-SETUP.md](BACKEND-SETUP.md) - Backend guide
- 📝 [CONTRIBUTING.md](CONTRIBUTING.md) - Contribution guidelines

---

## Sign-Off

- [ ] Code reviewed
- [ ] Tests passing
- [ ] Documentation complete
- [ ] Deployment verified
- [ ] Performance acceptable
- [ ] Security verified
- [ ] Monitoring enabled

**Deployment Date**: _______________  
**Deployed By**: _______________  
**Verified By**: _______________  

---

**Deployment Status**: 🚀 READY FOR LAUNCH

*Last Updated: December 2024*

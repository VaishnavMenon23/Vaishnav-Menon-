# ML Module Training Guide

## Quick Start

```bash
# 1. Train classifier
python AI\ Solutions/ML/training/scripts/train.py --out=AI\ Solutions/ML/models

# 2. Export to ONNX
python AI\ Solutions/ML/training/scripts/export_onnx.py \
  --model-dir=AI\ Solutions/ML/models \
  --out=AI\ Solutions/ML/models/onnx

# 3. Convert to TF.js (optional, for browser demo)
python AI\ Solutions/ML/training/scripts/convert_tfjs.py \
  --onnx-path=AI\ Solutions/ML/models/onnx/classifier.onnx \
  --out=AI\ Solutions/ML/models/tfjs
```

Or use npm scripts:

```bash
npm run ml:train
npm run ml:export:onnx
npm run ml:export:tfjs
```

## Dataset

Currently uses mock training data for phishing detection:

**Phishing Examples:**
- "Click here to verify your account immediately"
- "Urgent: Confirm your banking credentials now"
- "Your payment method needs verification"

**Benign Examples:**
- "How can I help you today?"
- "Portfolio showcases cybersecurity expertise"
- "Tell me more about your experience"

### Adding Your Own Dataset

1. Create `AI Solutions/ML/training/data/` directory
2. Add CSV with columns: `text,label` (label: 0=benign, 1=phishing)
3. Update train.py to load from CSV
4. Re-run training pipeline

## Model Architecture

Binary text classifier:
- **Input**: Text (tokenized, max 128 tokens)
- **Preprocessing**: Lowercase, punctuation removal, TF-IDF features
- **Model**: Dense layers with dropout
- **Output**: 2-class softmax (benign vs phishing)
- **Framework**: PyTorch / TensorFlow (exportable to ONNX)

## Export Formats

### ONNX (Server-side)
- **Location**: `AI Solutions/ML/models/onnx/classifier.onnx`
- **Framework**: ONNX Runtime (Node.js)
- **Performance**: ~10-50ms inference
- **Requirements**: onnxruntime package
- **Benefit**: Hardware acceleration, production-grade

### TF.js (Browser-side)
- **Location**: `AI Solutions/ML/models/tfjs/`
- **Framework**: TensorFlow.js
- **Performance**: ~50-200ms inference (browser-dependent)
- **Requirements**: TF.js CDN/package
- **Benefit**: Privacy (no server calls), offline capability
- **Note**: Optional; only use if model size < 10MB

## Metrics

Model evaluation results (from registry.json):

```json
{
  "accuracy": 0.92,
  "f1": 0.89,
  "precision": 0.91,
  "recall": 0.87
}
```

To improve:
- Add more training data
- Tune hyperparameters
- Try different architectures
- Use data augmentation

## Files Generated

After training:

```
AI Solutions/ML/
├── models/
│   ├── metadata.json       # Training metadata
│   ├── vocab.json          # Tokenizer vocabulary
│   ├── idf_weights.json    # TF-IDF weights
│   ├── onnx/
│   │   ├── classifier.onnx # ONNX model (primary)
│   │   └── manifest.json
│   └── tfjs/
│       ├── model.json
│       ├── weights.bin
│       └── manifest.json
└── registry.json           # Model registry
```

## Next Steps

1. **Improve Dataset**: Add real phishing/benign examples
2. **Multi-class Classification**: Extend to intent detection (FAQ, security, etc.)
3. **Model Versioning**: Track model performance over time
4. **A/B Testing**: Compare server vs browser inference
5. **Fine-tuning**: Adapt model for specific use cases

---

See [../README.md](../README.md) for integration instructions.

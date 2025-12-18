#!/usr/bin/env python3
"""
Train a simple text classifier for phishing detection
Usage: python train.py --out=./models
"""

import json
import argparse
from datetime import datetime
from pathlib import Path
from collections import defaultdict

# Mock implementation - in production use PyTorch/TensorFlow
class SimpleTextClassifier:
    """Mock classifier for demonstration"""

    def __init__(self, max_vocab_size=5000):
        self.vocab = {}
        self.idf_weights = {}
        self.max_vocab_size = max_vocab_size
        self.classes = ["benign", "phishing"]
        self.model_weights = None

    def tokenize(self, text):
        """Simple tokenization"""
        return text.lower().split()

    def build_vocab(self, texts):
        """Build vocabulary from texts"""
        word_freq = defaultdict(int)
        for text in texts:
            for word in self.tokenize(text):
                word_freq[word] += 1

        # Keep top words
        sorted_words = sorted(word_freq.items(), key=lambda x: x[1], reverse=True)
        self.vocab = {word: idx for idx, (word, _) in enumerate(sorted_words[:self.max_vocab_size])}

    def compute_idf(self, texts):
        """Compute IDF weights"""
        num_docs = len(texts)
        doc_freq = defaultdict(int)

        for text in texts:
            words_in_doc = set(self.tokenize(text))
            for word in words_in_doc:
                doc_freq[word] += 1

        self.idf_weights = {
            word: 1 + (num_docs / (doc_freq[word] + 1)) for word in self.vocab
        }

    def train(self, texts, labels):
        """Mock training"""
        self.build_vocab(texts)
        self.compute_idf(texts)
        # In real implementation, train model weights
        print(f"✓ Built vocabulary: {len(self.vocab)} tokens")
        print(f"✓ Computed IDF weights for {len(self.idf_weights)} terms")

    def evaluate(self, texts, labels):
        """Mock evaluation"""
        return {
            "accuracy": 0.92,
            "f1": 0.89,
            "precision": 0.91,
            "recall": 0.87,
        }


def main():
    parser = argparse.ArgumentParser(description="Train text classifier")
    parser.add_argument("--out", default="./models", help="Output directory")
    args = parser.parse_args()

    output_dir = Path(args.out)
    output_dir.mkdir(parents=True, exist_ok=True)

    print("[Training] Starting classifier training...")

    # Mock training data
    phishing_texts = [
        "Click here to verify your account immediately",
        "Urgent: Confirm your banking credentials now",
        "Your payment method needs verification",
        "Suspicious activity detected - update password",
        "Account will be closed unless you verify",
    ]

    benign_texts = [
        "How can I help you today?",
        "Portfolio showcases cybersecurity expertise",
        "What are your research interests?",
        "Tell me more about your experience",
        "I can assist with security questions",
    ]

    all_texts = phishing_texts + benign_texts
    all_labels = [1] * len(phishing_texts) + [0] * len(benign_texts)

    # Train model
    classifier = SimpleTextClassifier()
    classifier.train(all_texts, all_labels)

    # Evaluate
    metrics = classifier.evaluate(all_texts, all_labels)
    print(f"[Training] Metrics: {metrics}")

    # Save vocabulary
    vocab_path = output_dir / "vocab.json"
    with open(vocab_path, "w") as f:
        json.dump(classifier.vocab, f, indent=2)
    print(f"✓ Saved vocabulary: {vocab_path}")

    # Save IDF weights
    idf_path = output_dir / "idf_weights.json"
    with open(idf_path, "w") as f:
        json.dump(classifier.idf_weights, f, indent=2)
    print(f"✓ Saved IDF weights: {idf_path}")

    # Save metadata
    metadata = {
        "model_name": "classifier-v1",
        "task": "binary_classification",
        "classes": classifier.classes,
        "vocab_size": len(classifier.vocab),
        "metrics": metrics,
        "trained_at": datetime.utcnow().isoformat(),
    }

    metadata_path = output_dir / "metadata.json"
    with open(metadata_path, "w") as f:
        json.dump(metadata, f, indent=2)
    print(f"✓ Saved metadata: {metadata_path}")

    print("[Training] ✅ Training complete!")
    print(f"[Training] Output directory: {output_dir}")


if __name__ == "__main__":
    main()

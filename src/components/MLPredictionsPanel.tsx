/**
 * ML Predictions Component
 * Frontend UI for testing ML predictions
 */

import React, { useState } from 'react';
import { Activity, AlertCircle, CheckCircle2 } from 'lucide-react';

interface MLPredictionResponse {
  modelId: string;
  modelVersion: string;
  inferenceMs: number;
  result: string;
  confidence: number;
  probs: Record<string, number>;
  explainability?: {
    topTokens?: string[];
  };
  error?: string;
}

export const MLPredictionsPanel: React.FC = () => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState<MLPredictionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePredict = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/ml/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`,
        },
        body: JSON.stringify({
          modelId: 'classifier-v1',
          input: { text: input },
        }),
      });

      if (!res.ok) {
        throw new Error(`Prediction failed: ${res.status}`);
      }

      const data = await res.json();
      setResponse(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getRiskBadge = (result: string) => {
    const riskMap: Record<string, { color: string; icon: React.ReactNode }> = {
      phishing: { color: 'bg-red-100 text-red-800', icon: <AlertCircle className="w-4 h-4" /> },
      benign: { color: 'bg-green-100 text-green-800', icon: <CheckCircle2 className="w-4 h-4" /> },
      faq: { color: 'bg-blue-100 text-blue-800', icon: <Activity className="w-4 h-4" /> },
    };

    const risk = riskMap[result] || { color: 'bg-gray-100 text-gray-800', icon: <Activity className="w-4 h-4" /> };
    return risk;
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-700 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          🤖 ML Text Classification
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Test the ML model: phishing detection, intent routing, and more
        </p>
      </div>

      <div className="space-y-4">
        {/* Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Input Text
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter text to classify (e.g., phishing attempts, FAQs, etc.)"
            maxLength={10000}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md 
              bg-white dark:bg-slate-800 text-gray-900 dark:text-white
              focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {input.length} / 10000 characters
          </p>
        </div>

        {/* Predict Button */}
        <button
          onClick={handlePredict}
          disabled={loading || !input.trim()}
          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 
            text-white font-medium rounded-md transition-colors"
        >
          {loading ? 'Predicting...' : '🚀 Predict'}
        </button>

        {/* Error */}
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 
            rounded-md text-sm text-red-800 dark:text-red-300">
            {error}
          </div>
        )}

        {/* Response */}
        {response && !response.error && (
          <div className="space-y-4 p-4 bg-gray-50 dark:bg-slate-800 rounded-md">
            {/* Main Result */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Classification</span>
              <div className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2 ${getRiskBadge(response.result).color}`}>
                {getRiskBadge(response.result).icon}
                {response.result}
              </div>
            </div>

            {/* Confidence */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Confidence</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {(response.confidence * 100).toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${response.confidence * 100}%` }}
                ></div>
              </div>
            </div>

            {/* All Probabilities */}
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                All Probabilities
              </p>
              <div className="space-y-1">
                {Object.entries(response.probs).map(([cls, prob]) => (
                  <div key={cls} className="flex justify-between text-xs">
                    <span className="text-gray-600 dark:text-gray-400">{cls}</span>
                    <span className="text-gray-900 dark:text-white font-semibold">
                      {(prob * 100).toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Tokens (Explainability) */}
            {response.explainability?.topTokens && (
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Top Contributing Tokens
                </p>
                <div className="flex flex-wrap gap-2">
                  {response.explainability.topTokens.map((token) => (
                    <span
                      key={token}
                      className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 
                        text-xs rounded-full"
                    >
                      {token}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Metadata */}
            <div className="border-t border-gray-200 dark:border-slate-700 pt-3 text-xs text-gray-500 dark:text-gray-400">
              <p>Model: {response.modelId} v{response.modelVersion}</p>
              <p>Inference: {response.inferenceMs}ms</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MLPredictionsPanel;

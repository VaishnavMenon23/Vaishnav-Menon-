/**
 * Shared AI types and interfaces.
 */

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface StreamDelta {
  type: 'text' | 'done' | 'error';
  content?: string;
  error?: string;
  tokensUsed?: number;
}

export interface VoiceOptions {
  voice?: string;
  rate?: number; // -50 to 50 percent
  pitch?: number; // -50 to 50 percent
  language?: string; // e.g., 'en-US'
}

export interface EmbeddingRequest {
  texts: string[];
  model?: string;
}

export interface ChatStreamOptions {
  persona?: string;
  systemPrompt?: string;
  maxTokens?: number;
  temperature?: number;
}

export interface ModerationResult {
  allowed: boolean;
  reasons?: string[];
  score?: number;
}

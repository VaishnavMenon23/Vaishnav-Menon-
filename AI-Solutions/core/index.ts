/**
 * Main AI module public API.
 * Backend imports only from here.
 *
 * @module @ai/core
 */

import { loadConfig } from './config';
import { ChatMessage, StreamDelta, VoiceOptions, ChatStreamOptions, ModerationResult, EmbeddingRequest } from './types';
import { chatPipeline } from '../pipelines/chat.pipeline';
import { voicePipeline } from '../pipelines/voice.pipeline';
import { sttPipeline } from '../pipelines/stt.pipeline';
import { embeddingsPipeline } from '../pipelines/embeddings.pipeline';
import { checkModeration } from '../providers/moderation';

const config = loadConfig();

/**
 * Stream chat completions with system prompt + persona + moderation.
 *
 * @param messages - Chat message history
 * @param opts - Optional chat options (persona, system prompt, tokens, temp)
 * @returns Async iterable of StreamDelta events
 *
 * @example
 * for await (const delta of chatStream([{role: 'user', content: 'Hello'}])) {
 *   if (delta.type === 'text') console.log(delta.content);
 * }
 */
export async function* chatStream(
  messages: ChatMessage[],
  opts?: ChatStreamOptions
): AsyncIterable<StreamDelta> {
  yield* chatPipeline(config, messages, opts);
}

/**
 * Synthesize text-to-speech.
 *
 * @param text - Text to synthesize
 * @param opts - Voice options (voice, rate, pitch, language)
 * @returns MP3 audio buffer
 *
 * @example
 * const buffer = await tts('Hello, world!');
 * res.setHeader('Content-Type', 'audio/mpeg');
 * res.send(buffer);
 */
export async function tts(text: string, opts?: VoiceOptions): Promise<Buffer> {
  return voicePipeline(config, text, opts);
}

/**
 * Speech-to-text transcription.
 * TODO: Implement STT.
 */
export async function stt(audioBuffer: Buffer, language?: string): Promise<{ text: string; confidence: number }> {
  return sttPipeline(audioBuffer, language);
}

/**
 * Check content against moderation policies.
 *
 * @param text - Text to moderate
 * @returns ModerationResult with allowed flag and reasons
 */
export function moderate(text: string): ModerationResult {
  return checkModeration(text);
}

/**
 * Generate embeddings for texts.
 * TODO: Implement embeddings.
 */
export async function embeddings(req: EmbeddingRequest): Promise<number[][]> {
  return embeddingsPipeline(config, req);
}

// Export types and errors for backend consumption
export type { ChatMessage, StreamDelta, VoiceOptions, ChatStreamOptions, ModerationResult, EmbeddingRequest };
export * from './errors';

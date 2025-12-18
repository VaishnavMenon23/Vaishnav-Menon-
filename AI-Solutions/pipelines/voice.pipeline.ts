/**
 * Voice (TTS) pipeline.
 * Orchestrates voice synthesis.
 */

import { VoiceOptions } from '../core/types';
import { AIConfig } from '../core/config';
import { synthesizeSpeechAzure } from '../providers/speech.azure';
import { ValidationError } from '../core/errors';

export async function voicePipeline(
  config: AIConfig,
  text: string,
  opts?: VoiceOptions
): Promise<Buffer> {
  if (!text || text.trim().length === 0) {
    throw new ValidationError('Text cannot be empty');
  }

  if (text.length > 5000) {
    throw new ValidationError('Text exceeds max length of 5000 characters');
  }

  return synthesizeSpeechAzure(config, text, opts);
}

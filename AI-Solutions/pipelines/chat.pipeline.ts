/**
 * Chat pipeline.
 * Orchestrates system prompt + persona + moderation + streaming LLM.
 */

import { ChatMessage, StreamDelta, ChatStreamOptions } from '../core/types';
import { AIConfig } from '../core/config';
import { streamChatCompletionAzure } from '../providers/openai.azure';
import { checkModeration } from '../providers/moderation';
import { portfolioSystemPrompt } from '../prompts/system/portfolio.assistant';
import { defaultPersona } from '../prompts/personas/default';
import { ValidationError, ModerationError } from '../core/errors';

export async function* chatPipeline(
  config: AIConfig,
  messages: ChatMessage[],
  opts?: ChatStreamOptions
): AsyncIterable<StreamDelta> {
  // Validate input
  if (!messages || messages.length === 0) {
    throw new ValidationError('No messages provided');
  }

  const lastMsg = messages[messages.length - 1];
  if (lastMsg.role !== 'user') {
    throw new ValidationError('Last message must be from user');
  }

  // Check moderation on user input
  const modCheck = checkModeration(lastMsg.content);
  if (!modCheck.allowed) {
    throw new ModerationError(`Content rejected: ${modCheck.reasons?.join(', ')}`);
  }

  // Build system prompt
  const systemContent = opts?.systemPrompt || portfolioSystemPrompt;
  const personaContent = opts?.persona || defaultPersona;
  const fullSystemPrompt = `${systemContent}\n\n${personaContent}`;

  // Prepare messages for model
  const modelMessages: ChatMessage[] = [
    { role: 'system', content: fullSystemPrompt },
    ...messages
  ];

  // Stream from Azure OpenAI
  yield* streamChatCompletionAzure(config, modelMessages, opts);
}

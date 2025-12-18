/**
 * Azure OpenAI provider adapter.
 * Handles streaming chat completions with token deltas.
 */

// Using native fetch in Node 18+ or polyfilled by node-fetch if needed
const fetch = globalThis.fetch || require('node-fetch');
import { StreamDelta, ChatMessage, ChatStreamOptions } from '../core/types';
import { AIConfig } from '../core/config';

export async function* streamChatCompletionAzure(
  config: AIConfig,
  messages: ChatMessage[],
  opts?: ChatStreamOptions
): AsyncIterable<StreamDelta> {
  const { endpoint, apiKey, deployment } = config.openai;
  if (!endpoint || !apiKey) throw new Error('Azure OpenAI config missing');

  const url = `${endpoint}/openai/deployments/${deployment}/chat/completions?api-version=2023-10-01-preview`;
  const body = {
    messages,
    max_tokens: opts?.maxTokens ?? 1000,
    temperature: opts?.temperature ?? 0.2,
    stream: true
  };

  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': apiKey
    },
    body: JSON.stringify(body)
  });

  if (!resp.ok || !resp.body) {
    const txt = await resp.text();
    throw new Error(`OpenAI error: ${resp.status} ${txt}`);
  }

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let finished = false;

  while (!finished) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split(/\r?\n/);
    buffer = lines.pop() || '';

    for (const line of lines) {
      if (!line.trim()) continue;
      if (line.startsWith('data:')) {
        const payload = line.replace(/^data:\s*/, '').trim();
        if (payload === '[DONE]') { finished = true; break; }
        try {
          const parsed = JSON.parse(payload);
          const choices = parsed.choices || [];
          for (const c of choices) {
            const delta = c.delta?.content;
            if (delta) {
              yield { type: 'text', content: delta };
            }
          }
        } catch (e) {
          // ignore parse errors
        }
      }
    }
  }

  yield { type: 'done', tokensUsed: 0 }; // TODO: track actual tokens
}

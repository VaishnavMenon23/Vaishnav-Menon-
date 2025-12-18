# AI Module Architecture

## Overview

All AI functionality (chat streaming, voice synthesis, embeddings, moderation) is centralized under the `ai/` folder with a clean, provider-agnostic public API exposed from `ai/core/index.ts`.

## Folder Structure

```
ai/
  core/
    index.ts              # Public API entry point
    config.ts             # Environment config loader
    types.ts              # Shared TypeScript interfaces
    errors.ts             # Custom error classes

  providers/
    openai.azure.ts       # Azure OpenAI chat adapter
    speech.azure.ts       # Azure Speech TTS adapter
    moderation.ts         # Safety checks & content filtering
    embeddings.azure.ts   # Embeddings (stub)

  prompts/
    system/
      portfolio.assistant.md   # System prompt for portfolio assistant
      admin.tools.md           # Admin persona & tools
    personas/
      default.md           # User-facing assistant tone
      security.md          # Cybersecurity-focused persona

  pipelines/
    chat.pipeline.ts       # Orchestrates chat: moderation → system+persona → streaming
    voice.pipeline.ts      # Orchestrates TTS: validation → synthesis
    stt.pipeline.ts        # STT stub (future)
    embeddings.pipeline.ts # Embeddings stub (future)

  tools/
    sse.ts                 # Server-Sent Events utilities
    formatter.ts           # Markdown/code/link formatting
    cache.ts               # In-memory cache (stub)

  tests/
    chat.pipeline.spec.ts
    moderation.spec.ts
    voice.pipeline.spec.ts
```

## Public API (ai/core/index.ts)

All backend routes import **only** from `ai/core/index.ts`.

### `chatStream(messages, opts?): AsyncIterable<StreamDelta>`
Stream chat completions with system prompt + persona + moderation.

**Example:**
```typescript
for await (const delta of ai.chatStream([
  { role: 'user', content: 'Tell me about your AI projects' }
])) {
  if (delta.type === 'text') console.log(delta.content);
}
```

### `tts(text, opts?): Promise<Buffer>`
Synthesize text-to-speech as MP3 bytes.

**Example:**
```typescript
const buffer = await ai.tts('Hello world', { voice: 'en-US-GuyNeural' });
res.setHeader('Content-Type', 'audio/mpeg');
res.send(buffer);
```

### `stt(audioBuffer, language?): Promise<{text, confidence}>`
Transcribe speech (stub—implement via Azure Speech SDK).

### `moderate(text): ModerationResult`
Check content against safety policies.

**Returns:** `{ allowed: boolean, reasons?: string[] }`

### `embeddings(request): Promise<number[][]>`
Generate embeddings (stub—implement via Azure OpenAI).

## Backend Integration

Backend routes (`server/src/routes/*`) import **only**:
```typescript
import * as ai from '../../ai/core/index.js';
```

Example from `server/src/routes/chat.ts`:
```typescript
for await (const delta of ai.chatStream(messages)) {
  sseSend(res, delta.type, delta);
}
```

## Environment Variables

Read in `ai/core/config.ts`:
- `AZURE_OPENAI_ENDPOINT`
- `AZURE_OPENAI_API_KEY`
- `AZURE_OPENAI_DEPLOYMENT` (default: `gpt-4o`)
- `AZURE_SPEECH_KEY`
- `AZURE_SPEECH_REGION` (default: `eastus`)
- `DEFAULT_TTS_VOICE` (default: `en-US-GuyNeural`)
- `AI_DEFAULT_PERSONA` (default: `default`)
- `AI_RATE_LIMIT_RPM` (default: `120`)

## Key Design Decisions

- **Async Generators:** Chat streaming uses TypeScript async generators for clean iteration and backpressure handling.
- **No Direct Provider Calls Outside `ai/`:** All Azure SDK calls live inside providers; routes only call the public API.
- **Moderation First:** User input is checked before passing to LLM to block harmful content early.
- **Personalization:** System prompt + persona are combined to shape assistant behavior.
- **Error Hierarchy:** Custom errors (`AIError`, `ValidationError`, `ModerationError`) for precise error handling.

## Testing

Run individual test suites:
```bash
node ai/tests/moderation.spec.ts
node ai/tests/chat.pipeline.spec.ts
node ai/tests/voice.pipeline.spec.ts
```

## Future Expansions

- **Streaming STT:** Implement via Azure Speech WebSocket.
- **Embeddings Pipeline:** Chunking, batching, vector DB persistence.
- **Tool Use:** Function calling for admin actions.
- **Fine-tuning:** Persona-aware prompt engineering.
- **Caching:** LRU cache for embeddings and frequent queries.

// This service is deprecated - use AI Solutions/providers instead
// Kept for backward compatibility during migration

const ENDPOINT = process.env.AZURE_OPENAI_ENDPOINT;
const API_KEY = process.env.AZURE_OPENAI_API_KEY;
const DEPLOYMENT = process.env.AZURE_OPENAI_DEPLOYMENT || 'gpt-4o';

export async function streamChatCompletion(messages: any[], onDelta: (d: string) => void) {
  if (!ENDPOINT || !API_KEY) throw new Error('Azure OpenAI config missing');

  const url = `${ENDPOINT}/openai/deployments/${DEPLOYMENT}/chat/completions?api-version=2023-10-01-preview`;
  const body = {
    messages,
    max_tokens: 1000,
    temperature: 0.2,
    stream: true
  };

  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': API_KEY
    },
    body: JSON.stringify(body)
  });

  if (!resp.ok) {
    const txt = await resp.text();
    throw new Error(`OpenAI error: ${resp.status} ${txt}`);
  }

  // Use Response.text() and parse stream manually
  const text = await resp.text();
  const lines = text.split(/\n/).filter(l => l.trim());
  
  for (const line of lines) {
    if (line.startsWith('data:')) {
      const payload = line.replace(/^data:\s*/, '').trim();
      if (payload === '[DONE]') break;
      try {
        const parsed = JSON.parse(payload);
        const delta = parsed.choices?.[0]?.delta?.content;
        if (delta) onDelta(delta);
      } catch (e) {
        // non-json chunk
        onDelta(payload);
      }
    }
  }
}

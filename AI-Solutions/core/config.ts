/**
 * AI configuration: reads env vars and exposes provider keys + defaults.
 */

export interface AIConfig {
  openai: {
    endpoint: string;
    apiKey: string;
    deployment: string;
  };
  speech: {
    key: string;
    region: string;
    defaultVoice: string;
  };
  defaults: {
    persona: string;
    rateLimitRPM: number;
    maxTokens: number;
    temperature: number;
  };
}

export function loadConfig(): AIConfig {
  return {
    openai: {
      endpoint: process.env.AZURE_OPENAI_ENDPOINT || '',
      apiKey: process.env.AZURE_OPENAI_API_KEY || '',
      deployment: process.env.AZURE_OPENAI_DEPLOYMENT || 'gpt-4o'
    },
    speech: {
      key: process.env.AZURE_SPEECH_KEY || '',
      region: process.env.AZURE_SPEECH_REGION || 'eastus',
      defaultVoice: process.env.DEFAULT_TTS_VOICE || 'en-US-GuyNeural'
    },
    defaults: {
      persona: process.env.AI_DEFAULT_PERSONA || 'default',
      rateLimitRPM: parseInt(process.env.AI_RATE_LIMIT_RPM || '120', 10),
      maxTokens: 1000,
      temperature: 0.2
    }
  };
}

/**
 * Azure Speech provider adapter.
 * Handles TTS (text-to-speech) synthesis via REST API.
 */

// Using native fetch in Node 18+ or polyfilled by node-fetch if needed
const fetch = globalThis.fetch || require('node-fetch');
import { VoiceOptions } from '../core/types';
import { AIConfig } from '../core/config';

export async function synthesizeSpeechAzure(
  config: AIConfig,
  text: string,
  opts?: VoiceOptions
): Promise<Buffer> {
  const { key, region, defaultVoice } = config.speech;
  if (!key || !region) throw new Error('Azure Speech config missing');

  const voiceName = opts?.voice || defaultVoice;
  const rate = opts?.rate ?? 0;
  const pitch = opts?.pitch ?? 0;

  const ssml = buildSSML(text, voiceName, rate, pitch);
  const url = `https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`;

  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      'Ocp-Apim-Subscription-Key': key,
      'Content-Type': 'application/ssml+xml',
      'X-Microsoft-OutputFormat': 'audio-16khz-32kbitrate-mono-mp3'
    },
    body: ssml
  });

  if (!resp.ok) {
    const body = await resp.text();
    throw new Error(`TTS error ${resp.status}: ${body}`);
  }

  return (await resp.buffer()) as Buffer;
}

function buildSSML(text: string, voice: string, rate: number, pitch: number): string {
  return `<?xml version="1.0" encoding="utf-8"?>
  <speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">
    <voice name="${voice}"><prosody rate="${rate}%" pitch="${pitch}%">${escapeXml(text)}</prosody></voice>
  </speak>`;
}

function escapeXml(s: string): string {
  return s.replace(/[<>&"']/g, (c) => ({
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
    '"': '&quot;',
    "'": '&apos;'
  }[c] || c));
}

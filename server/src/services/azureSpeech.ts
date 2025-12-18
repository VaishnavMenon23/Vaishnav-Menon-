import fetch from 'node-fetch';

const REGION = process.env.AZURE_SPEECH_REGION;
const KEY = process.env.AZURE_SPEECH_KEY;
const DEFAULT_VOICE = process.env.DEFAULT_TTS_VOICE || 'en-US-GuyNeural';

export async function synthesizeSpeechToMp3(text: string, voice?: string, rate?: number, pitch?: number) {
  if (!REGION || !KEY) throw new Error('Azure Speech config missing');
  const voiceName = voice || DEFAULT_VOICE;
  const ssml = `<?xml version="1.0" encoding="utf-8"?>
  <speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">
    <voice name="${voiceName}"><prosody rate="${rate ?? 0}%" pitch="${pitch ?? 0}%">${escapeXml(text)}</prosody></voice>
  </speak>`;

  const url = `https://${REGION}.tts.speech.microsoft.com/cognitiveservices/v1`;
  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      'Ocp-Apim-Subscription-Key': KEY,
      'Content-Type': 'application/ssml+xml',
      'X-Microsoft-OutputFormat': 'audio-16khz-32kbitrate-mono-mp3'
    },
    body: ssml
  });
  if (!resp.ok) {
    const body = await resp.text();
    throw new Error(`TTS error ${resp.status}: ${body}`);
  }
  const buffer = await resp.buffer();
  return buffer;
}

function escapeXml(s: string) {
  return s.replace(/[<>&"']/g, (c) => ({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&apos;'} as any)[c]);
}

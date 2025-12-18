/**
 * STT pipeline.
 * TODO: Orchestrate speech-to-text via Azure Speech SDK or REST.
 */

export async function sttPipeline(audioBuffer: Buffer, language = 'en-US'): Promise<{ text: string; confidence: number }> {
  // TODO: implement STT
  console.warn('STT not yet implemented');
  return { text: '', confidence: 0 };
}

/**
 * Voice (TTS) pipeline tests.
 */

import { tts } from '../core/index';

export async function testVoicePipelineBasic() {
  try {
    const buffer = await tts('Hello, this is a test.');
    if (buffer && buffer.length > 0) {
      console.log(`✓ Voice pipeline: Generated ${buffer.length} bytes of audio`);
    } else {
      console.log('✗ Voice pipeline: Buffer empty');
    }
  } catch (e: any) {
    console.error('✗ Voice pipeline test failed:', e.message);
  }
}

if (process.argv[1]?.endsWith('voice.pipeline.spec.ts')) {
  testVoicePipelineBasic();
}

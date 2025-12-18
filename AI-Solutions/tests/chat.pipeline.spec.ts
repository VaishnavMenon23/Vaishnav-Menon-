/**
 * Chat pipeline tests.
 */

import { chatStream } from '../core/index';
import { ChatMessage } from '../core/types';

// Stub test: basic structure
export async function testChatPipelineBasic() {
  const messages: ChatMessage[] = [
    { role: 'user', content: 'Hello, who are you?' }
  ];

  try {
    let collected = '';
    for await (const delta of chatStream(messages)) {
      if (delta.type === 'text' && delta.content) {
        collected += delta.content;
      } else if (delta.type === 'done') {
        console.log(`Chat complete. Collected: ${collected.length} chars`);
      }
    }
    console.log('✓ Chat pipeline test passed');
  } catch (e: any) {
    console.error('✗ Chat pipeline test failed:', e.message);
  }
}

if (process.argv[1]?.endsWith('chat.pipeline.spec.ts')) {
  testChatPipelineBasic();
}

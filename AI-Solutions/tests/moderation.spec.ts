/**
 * Moderation tests.
 */

import { moderate } from '../core/index';

export function testModerationBasic() {
  const tests = [
    { text: 'Hello, how are you?', expectAllowed: true },
    { text: 'I hate everything', expectAllowed: false }, // contains toxicity
    { text: 'My SSN is 123-45-6789', expectAllowed: false } // PII
  ];

  let passed = 0;
  for (const t of tests) {
    const result = moderate(t.text);
    if (result.allowed === t.expectAllowed) {
      console.log(`✓ Moderation: "${t.text.substring(0, 30)}" → ${result.allowed}`);
      passed++;
    } else {
      console.log(`✗ Moderation: "${t.text.substring(0, 30)}" → expected ${t.expectAllowed}, got ${result.allowed}`);
    }
  }
  console.log(`Moderation tests: ${passed}/${tests.length} passed`);
}

if (process.argv[1]?.endsWith('moderation.spec.ts')) {
  testModerationBasic();
}

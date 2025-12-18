/**
 * Formatter utilities.
 * Markdown, code block, link sanitization.
 */

export function sanitizeLinks(text: string): string {
  // TODO: implement link sanitization
  return text;
}

export function formatCode(code: string, language = 'text'): string {
  return `\`\`\`${language}\n${code}\n\`\`\``;
}

export function formatMarkdown(text: string): string {
  // TODO: additional markdown safety checks
  return text;
}

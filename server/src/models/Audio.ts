export interface AudioDoc {
  id: string;
  sessionId?: string;
  userId?: string;
  type: 'stt' | 'tts';
  url: string;
  durationMs?: number;
  createdAt?: string;
}

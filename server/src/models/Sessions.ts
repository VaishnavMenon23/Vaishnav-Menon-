export interface SessionDoc {
  id: string;
  userId?: string;
  status?: 'active' | 'closed';
  startedAt?: string;
  endedAt?: string;
}

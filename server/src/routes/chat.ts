import express from 'express';
import * as ai from '../../../AI Solutions/core/index';
import { initSSE, sseSend, sseEnd } from '../../../AI Solutions/tools/sse';
const router = express.Router();

// SSE streaming chat endpoint
router.post('/message/stream', async (req: any, res) => {
  try {
    initSSE(res);
    const { sessionId, text, history } = req.body;
    const user = req.user || { sub: 'anon' };
    const messages = [] as any[];
    if (history && Array.isArray(history)) messages.push(...history);
    messages.push({ role: 'user', content: text });

    // Stream deltas via AI core
    for await (const delta of ai.chatStream(messages)) {
      sseSend(res, delta.type, delta);
    }

    sseEnd(res);
  } catch (e: any) {
    sseSend(res, 'error', { message: e.message });
    sseEnd(res);
  }
});

router.get('/history', async (req, res) => {
  // TODO: read from Cosmos DB; returning placeholder for MVP
  const { sessionId } = req.query;
  res.json({ sessionId, messages: [] });
});

export default router;

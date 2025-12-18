import express from 'express';
import { requireRole } from '../middleware/auth.js';
const router = express.Router();

router.use(requireRole('ADMIN'));

router.get('/analytics', (req, res) => {
  // TODO: aggregate from analytics store
  res.json({ sessions: 123, avgLatencyMs: 200 });
});

router.post('/prompts', (req, res) => {
  // TODO: store prompt in Cosmos
  res.json({ ok: true });
});

router.post('/voices', (req, res) => {
  // TODO: update voice defaults
  res.json({ ok: true });
});

router.post('/content', (req, res) => {
  // TODO: update portfolio content
  res.json({ ok: true });
});

export default router;

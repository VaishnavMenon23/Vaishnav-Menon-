import express from 'express';
const router = express.Router();

router.get('/me', (req: any, res) => {
  // requireAuth should attach `user` to req
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  const { sub, email, name, roles } = req.user;
  res.json({ id: sub, email, name, roles });
});

export default router;

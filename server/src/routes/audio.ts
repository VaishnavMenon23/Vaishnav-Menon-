import express from 'express';
import * as ai from '../../../AI Solutions/core/index';
import { uploadAudio } from '../services/storage';
const router = express.Router();

router.post('/tts', async (req: any, res) => {
  try {
    const { text, voice, rate, pitch } = req.body;
    if (!text) return res.status(400).json({ error: 'Missing text' });
    const buffer = await ai.tts(text, { voice, rate, pitch });
    // optional: upload to blob and return URL
    const filename = `tts_${Date.now()}.mp3`;
    let url: string | null = null;
    try { url = await uploadAudio(filename, buffer); } catch (e) { url = null; }

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Length', String(buffer.length));
    if (url) res.setHeader('X-Audio-Url', url);
    res.send(buffer);
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

export default router;

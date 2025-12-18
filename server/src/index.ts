import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';

dotenv.config();

import authRoutes from './routes/auth';
import chatRoutes from './routes/chat';
import audioRoutes from './routes/audio';
import adminRoutes from './routes/admin';

import { requireAuth } from './middleware/auth';
import { rateLimit } from './middleware/rateLimit';
import { errorHandler } from './middleware/error';
import { validateInput, validateSize, createCorsValidator } from './middleware/validation';

const app = express();
const PORT = process.env.PORT || 8080;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Strict CORS (allow localhost in dev, set allowed origins in prod via env)
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000,http://localhost:5173').split(',');
if (NODE_ENV === 'production') {
  app.use(createCorsValidator(allowedOrigins));
} else {
  app.use(cors({ origin: allowedOrigins }));
}

app.use(express.json({ limit: '1mb' }));
app.use(validateSize);
app.use(validateInput);
app.use(morgan('dev'));

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
});

// public health
app.get('/health', (req, res) => res.json({ ok: true }));

// attach middleware
app.use('/api/auth', authRoutes);
app.use('/api', rateLimit, requireAuth, chatRoutes);
app.use('/api/audio', rateLimit, requireAuth, audioRoutes);
app.use('/api/admin', requireAuth, adminRoutes);

app.use(errorHandler as any);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT} (${NODE_ENV})`);
});

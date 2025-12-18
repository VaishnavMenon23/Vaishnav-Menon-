# Server (Express) — Vaishnav Portfolio

Run locally:

```bash
cd server
cp .env.example .env
# fill .env
npm install
npm run dev
```

Endpoints (MVP):

- `GET /api/auth/me` — returns decoded token claims (id,email,roles)
- `POST /api/chat/message/stream` — SSE streaming chat response
- `POST /api/audio/tts` — returns TTS audio (MP3)
- `GET /api/chat/history?sessionId=...` — message history
- Admin routes under `/api/admin/*` — require ADMIN role

Populate `.env` with Azure keys and Entra ID values.

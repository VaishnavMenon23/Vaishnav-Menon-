# Backend Setup Guide

## Prerequisites

- **Node.js 18+** (v24.12.0 recommended)
- **npm 11.6.2+**
- Microsoft Azure account with:
  - Azure OpenAI deployment (gpt-4o)
  - Azure Cognitive Services Speech
  - Azure Cosmos DB
  - Azure Blob Storage
  - Microsoft Entra ID (Azure AD)

## Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment variables**
   - Copy `.env.example` to `.env` in the root directory
   - Fill in all required Azure credentials and endpoints
   - Ensure `AAD_ISSUER`, `AAD_AUDIENCE`, and `AAD_CLIENT_ID` are set

3. **Verify dependencies**
   ```bash
   npm run typecheck
   ```

## Development

Start the dev server with hot reload:
```bash
npm run dev
```

Server runs on `http://localhost:8080` by default.

Health check: `GET http://localhost:8080/health`

## Building

Create a production build:
```bash
npm run build
```

## Testing

Run the AI Solutions test suite:
```bash
npm run test
```

## Deployment

1. Build the project:
   ```bash
   npm run build
   ```

2. Set production environment variables in your deployment platform

3. Start the server:
   ```bash
   npm start
   ```

## API Endpoints

### Authentication
- `GET /api/auth/me` - Get current user claims (requires Bearer token)

### Chat
- `POST /api/chat/message/stream` - Stream chat response via Server-Sent Events
  - Required header: `Authorization: Bearer <token>`
  - Body: `{ "message": "user question" }`

### Audio
- `POST /api/audio/tts` - Text-to-speech synthesis
  - Required header: `Authorization: Bearer <token>`
  - Body: `{ "text": "hello world" }`
  - Returns: MP3 audio buffer

### Admin
- `GET /api/admin/stats` - Get system statistics (requires ADMIN role)
- `POST /api/admin/audit` - Submit audit log entry (requires ADMIN role)

## Security Features

- **JWT Authentication**: All `/api/*` routes require Bearer token from Azure Entra ID
- **Rate Limiting**: IP-based rate limiting (60 requests/minute)
- **Input Validation**: XSS-safe string sanitization, 1MB payload limit
- **CORS**: Strict CORS configuration via `ALLOWED_ORIGINS` env var
- **Security Headers**: X-Frame-Options, X-Content-Type-Options, X-XSS-Protection, HSTS

## Troubleshooting

### Port Already in Use
```bash
# Change PORT env var
PORT=8081 npm run dev
```

### Missing Azure Credentials
Verify all required env vars are set in `.env`:
```bash
cat .env | grep -i azure
```

### TypeScript Errors
Run typecheck to see all errors:
```bash
npm run typecheck
```

### Test Failures
Check AI Solutions test suite:
```bash
npm run test
```

## Project Structure

```
server/
├── src/
│   ├── index.ts              # Express app and middleware setup
│   ├── routes/               # API endpoints
│   ├── middleware/           # Express middleware (auth, validation, rate limiting)
│   └── services/             # Azure services, logger
├── AI Solutions/             # AI and ML pipelines
│   ├── core/                 # Public API surface
│   ├── providers/            # Azure OpenAI, Speech, Moderation
│   ├── pipelines/            # Chat, voice, embeddings
│   ├── prompts/              # System prompts and personas
│   ├── tools/                # Utilities (SSE, formatters)
│   └── tests/                # Test suite
├── package.json
├── tsconfig.json
└── .env.example
```

## Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) for coding standards and development guidelines.

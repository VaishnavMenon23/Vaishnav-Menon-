# Vaishnav Padmakumar Menon - AI & Cybersecurity Portfolio

A comprehensive, full-stack portfolio website featuring:
- **Frontend**: Modern React 18 portfolio with dark mode and interactive components
- **Backend**: Express API with Azure OpenAI chat streaming, text-to-speech, and role-based authentication
- **AI**: Unified AI Solutions module for chat, voice, moderation, and embeddings

Showcasing AI & Cybersecurity expertise with Microsoft Azure tools.

## 🎯 Project Overview

### Frontend (React + Vite)
- 🎨 Microsoft-style design with Tailwind CSS
- 🌓 Dark/light mode toggle
- ⚡ Fast performance with Vite
- 📱 Fully responsive, mobile-first
- ♿ WCAG 2.1 AA accessible

### Backend (Express + TypeScript)
- 🔐 Azure Entra ID authentication (JWT + JWKS)
- 💬 Real-time chat streaming via Server-Sent Events
- 🎤 Text-to-speech synthesis with Azure Cognitive Services
- 🛡️ Rate limiting, input validation, security headers
- 📊 Cosmos DB integration for data persistence

### AI Solutions Module
- 🤖 Unified AI API surface
- 🧠 Azure OpenAI integration (gpt-4o)
- 🎙️ Speech synthesis and recognition
- 🔍 Content moderation (PII detection, toxicity filtering)
- 🧬 Embedding generation for semantic search

## Tech Stack

**Frontend**: React 18 • TypeScript • Tailwind CSS • Vite • Framer Motion • Lucide React
**Backend**: Node.js • Express • TypeScript • Azure OpenAI • Azure Speech • Cosmos DB
**Auth**: Microsoft Entra ID • JWT • JWKS
**Infrastructure**: Azure (OpenAI, Speech, Storage, Cosmos DB, Blob)

## Quick Start

### Prerequisites
- Node.js 18+ and npm 11.6.2+
- Azure account with configured services (see BACKEND-SETUP.md)

### Installation & Development

**Frontend:**
```bash
npm install
npm run dev
# Open http://localhost:5173 or http://localhost:3000
```

**Backend:**
```bash
cd server
npm install
# Configure .env with Azure credentials
npm run dev
# Server runs on http://localhost:8080
```

Full setup instructions: See [BACKEND-SETUP.md](server/BACKEND-SETUP.md)

## Project Structure

```
.
├── src/                                    # Frontend (React + Tailwind)
│   ├── components/
│   │   ├── Hero.tsx                       # Hero section
│   │   ├── Summary.tsx                    # About section
│   │   ├── Skills.tsx                     # Skills grid
│   │   ├── Projects.tsx                   # Project showcase
│   │   ├── Experience.tsx                 # Timeline
│   │   ├── Certifications.tsx             # Certifications
│   │   ├── Education.tsx                  # Education
│   │   ├── Contact.tsx                    # Contact form
│   │   ├── Navigation.css                 # Navigation styles
│   │   └── ThemeToggle.tsx                # Dark mode
│   ├── data/
│   │   └── portfolioData.ts               # Portfolio content
│   ├── styles/
│   │   └── globals.css                    # Global styles
│   ├── App.tsx                            # Main app
│   └── main.tsx                           # Entry point
│
├── server/                                 # Backend (Express + TypeScript)
│   ├── src/
│   │   ├── index.ts                       # Express app
│   │   ├── routes/
│   │   │   ├── auth.ts                    # /api/auth
│   │   │   ├── chat.ts                    # /api/chat (streaming)
│   │   │   ├── audio.ts                   # /api/audio (TTS)
│   │   │   └── admin.ts                   # /api/admin
│   │   ├── middleware/
│   │   │   ├── auth.ts                    # JWT + JWKS verification
│   │   │   ├── rateLimit.ts               # Rate limiting
│   │   │   ├── error.ts                   # Error handling
│   │   │   └── validation.ts              # Input validation
│   │   └── services/
│   │       ├── logger.ts                  # Logging
│   │       ├── cosmos.ts                  # Cosmos DB client
│   │       └── storage.ts                 # Azure Storage
│   │
│   ├── AI Solutions/                      # Unified AI module
│   │   ├── core/
│   │   │   ├── index.ts                   # Public API surface
│   │   │   ├── types.ts                   # Type definitions
│   │   │   ├── errors.ts                  # Error classes
│   │   │   └── config.ts                  # Configuration
│   │   ├── providers/
│   │   │   ├── openai.azure.ts            # Chat streaming
│   │   │   ├── speech.azure.ts            # TTS synthesis
│   │   │   ├── moderation.ts              # Content moderation
│   │   │   └── embeddings.azure.ts        # Embeddings
│   │   ├── pipelines/
│   │   │   ├── chat.pipeline.ts           # Chat orchestration
│   │   │   ├── voice.pipeline.ts          # TTS orchestration
│   │   │   ├── stt.pipeline.ts            # STT orchestration
│   │   │   └── embeddings.pipeline.ts     # Embeddings orchestration
│   │   ├── prompts/
│   │   │   ├── system/
│   │   │   │   ├── portfolio.assistant.ts # Portfolio assistant
│   │   │   │   └── admin.tools.ts         # Admin assistant
│   │   │   └── personas/
│   │   │       ├── default.ts             # Default tone
│   │   │       └── security.ts            # Security tone
│   │   ├── tools/
│   │   │   ├── sse.ts                     # SSE utilities
│   │   │   ├── formatter.ts               # Text formatting
│   │   │   └── cache.ts                   # LRU cache
│   │   ├── tests/
│   │   │   ├── chat.pipeline.spec.ts      # Chat tests
│   │   │   ├── moderation.spec.ts         # Moderation tests
│   │   │   └── voice.pipeline.spec.ts     # TTS tests
│   │   └── README.md                      # AI architecture guide
│   │
│   ├── package.json                       # Server dependencies
│   ├── tsconfig.json                      # TypeScript config
│   ├── BACKEND-SETUP.md                   # Backend setup guide
│   └── .env.example                       # Environment template
│
├── package.json                           # Frontend dependencies
├── tsconfig.json                          # Frontend TypeScript config
├── vite.config.ts                         # Vite configuration
├── tailwind.config.js                     # Tailwind configuration
├── postcss.config.js                      # PostCSS configuration
├── README.md                              # This file
├── CONTRIBUTING.md                        # Development guidelines
├── SETUP.md                               # Initial setup
└── .env.example                           # Environment template
```

## Frontend Customization

### Edit Content
All portfolio content is in `src/data/portfolioData.ts`:

```typescript
export const portfolioData = {
  hero: { ... },
  skills: { ... },
  projects: [ ... ],
  experience: [ ... ],
  // ...
}
```

### Styling
- **Colors**: `tailwind.config.js` (Microsoft brand)
- **Fonts**: Default Segoe UI
- **Custom CSS**: `src/styles/globals.css`

### Add/Remove Sections
Components are modular. Edit `src/App.tsx` to add/remove sections.

## Backend API

### Authentication
```bash
GET /api/auth/me
Authorization: Bearer <token>
```

### Chat (Streaming)
```bash
POST /api/chat/message/stream
Authorization: Bearer <token>
Content-Type: application/json

{ "message": "What is cybersecurity?" }
```
Returns: Server-Sent Events stream

### Text-to-Speech
```bash
POST /api/audio/tts
Authorization: Bearer <token>
Content-Type: application/json

{ "text": "Hello world" }
```
Returns: MP3 audio buffer

### Admin
```bash
GET /api/admin/stats
Authorization: Bearer <token>
X-Required-Role: ADMIN
```

Full API docs: [BACKEND-SETUP.md](server/BACKEND-SETUP.md)

## Environment Variables

Copy `.env.example` to `.env` and fill in:

```bash
# Frontend (optional)
VITE_API_URL=http://localhost:8080

# Backend (required)
PORT=8080
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173

# Azure
AZURE_OPENAI_KEY=...
AZURE_OPENAI_ENDPOINT=...
AZURE_SPEECH_KEY=...
AZURE_SPEECH_REGION=...
COSMOS_ENDPOINT=...
COSMOS_KEY=...

# Entra ID
AAD_ISSUER=...
AAD_AUDIENCE=...
AAD_CLIENT_ID=...
```

See `.env.example` for complete list.

## Development

### Running Both Frontend and Backend

**Terminal 1 (Frontend)**:
```bash
npm run dev
```

**Terminal 2 (Backend)**:
```bash
cd server && npm run dev
```

Visit: `http://localhost:5173` (frontend) + `http://localhost:8080/health` (backend)

### Type Checking
```bash
npm run typecheck          # Frontend
cd server && npm run typecheck  # Backend
```

### Testing
```bash
cd server && npm run test
```

### Building
```bash
npm run build              # Frontend
cd server && npm run build  # Backend
```

## Deployment

### Frontend
- **Vercel** (recommended): `vercel deploy`
- **Azure Static Web Apps**: Link GitHub repo to Azure
- **GitHub Pages**: `npm run build` → push `dist/`

### Backend
- **Azure App Service**: Deploy via Azure CLI or GitHub Actions
- **AWS Lambda/EC2**: Standard Node.js deployment
- **Render/Railway**: Connect GitHub repo

See [BACKEND-SETUP.md](server/BACKEND-SETUP.md#deployment) for detailed instructions.

## Performance

- ✅ Lighthouse: 90+
- ✅ Frontend build: < 1MB (minified)
- ✅ Response times: < 200ms (excluding AI)
- ✅ Chat streaming: Real-time SSE
- ✅ Rate limiting: 60 req/min per IP

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT License - feel free to use this template for your own portfolio!

## Contact

- Email: vaishnav.menon@example.com
- LinkedIn: https://linkedin.com/in/vaishnavmenon
- GitHub: https://github.com/vaishnavmenon

---

Built with ❤️ for Microsoft and AI & Cybersecurity roles.

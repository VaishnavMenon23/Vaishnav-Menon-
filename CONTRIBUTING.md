# Contributing Guide

## Code Standards

### TypeScript
- Use strict mode (`"strict": true` in tsconfig.json)
- No `any` types without explicit `// @ts-ignore` comment with reason
- Use interfaces for object types, not type aliases unless necessary
- Always specify return types on functions

### Naming Conventions
- **Files**: kebab-case (e.g., `auth.middleware.ts`)
- **Folders**: kebab-case (e.g., `middleware/`)
- **Functions**: camelCase
- **Classes**: PascalCase
- **Constants**: UPPER_SNAKE_CASE (for module-level constants)

### File Organization

**Backend Routes** (`server/src/routes/*.ts`):
```typescript
import { Router, RequestHandler } from 'express';
import { requireAuth, requireRole } from '../middleware/auth';
import * as ai from '../../../AI Solutions/core/index';

const router = Router();

// Handler
const handler: RequestHandler = async (req, res, next) => {
  // implementation
};

router.get('/', requireAuth, handler);

export default router;
```

**Middleware** (`server/src/middleware/*.ts`):
```typescript
import { RequestHandler } from 'express';

export const middleware: RequestHandler = (req, res, next) => {
  // implementation
  next();
};
```

**AI Services** (`AI Solutions/*`):
- Core API exports in `core/index.ts` only
- Providers handle external service calls
- Pipelines orchestrate multi-step flows
- Tests colocate with implementations

### Error Handling

Use specific error types:
```typescript
import { AIError, ValidationError } from '../../../AI Solutions/core/errors';

try {
  // implementation
} catch (e) {
  if (e instanceof ValidationError) {
    return res.status(400).json({ error: e.message });
  }
  throw new AIError(`Chat failed: ${e.message}`);
}
```

### Logging

Use the logger service for all logging:
```typescript
import { logger } from '../services/logger';

logger.info('Operation completed');
logger.warn('Unusual condition detected');
logger.error('Critical error', error);
```

### Comments

- **Why**, not **what**: Comments explain reasoning, not obvious code
- Single-line comments: `// explanation`
- Multi-line comments: `/* explanation */`
- TODO comments: `// TODO: [ISSUE-123] description`

```typescript
// ❌ Bad: restates code
// increment counter
counter++;

// ✅ Good: explains why
// increment counter to track attempts (max 3 per user)
counter++;
```

## Development Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feat/my-feature
   ```

2. **Make changes and test**
   ```bash
   npm run dev        # Start dev server
   npm run typecheck  # Verify types
   npm run test       # Run tests
   ```

3. **Commit with clear messages**
   ```bash
   git commit -m "feat: add text-to-speech support for chat responses"
   ```

4. **Push and create PR**
   ```bash
   git push origin feat/my-feature
   ```

## Testing

### Writing Tests

Tests live in `AI Solutions/tests/` with `.spec.ts` suffix:

```typescript
import { chatStream } from '../core/index';
import { ChatMessage } from '../core/types';

describe('chatStream', () => {
  it('should stream chat responses', async () => {
    const messages: ChatMessage[] = [
      { role: 'user', content: 'hello' }
    ];
    
    const chunks: string[] = [];
    await chatStream(messages, (chunk) => chunks.push(chunk));
    
    expect(chunks.length).toBeGreaterThan(0);
    expect(chunks.join('').length).toBeGreaterThan(0);
  });
});
```

### Running Tests

```bash
npm run test
```

All tests must pass before merging.

## PR Review Checklist

Before requesting review, ensure:
- [ ] No TypeScript errors: `npm run typecheck`
- [ ] All tests passing: `npm run test`
- [ ] Meaningful commit messages following conventional commits
- [ ] No hardcoded secrets in code
- [ ] Environment variables documented in `.env.example`
- [ ] Changes don't break existing APIs

## Commit Message Format

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

Examples:
```
feat(chat): add streaming support for long responses
fix(auth): validate Bearer token scheme
docs(api): update endpoint documentation
```

## Release Process

1. Update version in `package.json`
2. Create CHANGELOG entry
3. Tag commit: `git tag v1.2.3`
4. Deploy to production

## Performance Guidelines

- Keep response times under 200ms (excluding AI processing)
- Implement caching for frequently accessed data
- Use pagination for list endpoints (max 100 items per page)
- Profile before optimizing

## Security Guidelines

- Never log or commit `.env` files
- Sanitize all user input before processing
- Validate request Content-Type and body size
- Use HTTPS in production
- Rotate Azure keys regularly
- Implement audit logging for sensitive operations

## Questions?

Refer to:
- Backend setup: [BACKEND-SETUP.md](./BACKEND-SETUP.md)
- AI Solutions architecture: [AI Solutions/README.md](./AI%20Solutions/README.md)
- Azure docs: https://learn.microsoft.com/azure/

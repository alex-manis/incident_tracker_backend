# Incident Tracker Backend

Express API server for the incident tracking system.

## Technologies

- Node.js + Express + TypeScript
- PostgreSQL + Prisma ORM
- JWT authentication with refresh token rotation
- pino logger
- Prometheus metrics

## Installation

```bash
pnpm install
```

## Configuration

1. Copy `.env.example` to `.env`
2. Configure environment variables:
   - `DATABASE_URL` - PostgreSQL connection string
   - `JWT_SECRET` - JWT secret key (minimum 32 characters)
   - `JWT_REFRESH_SECRET` - Refresh token secret key (minimum 32 characters)
   - `PORT` - Server port (default 3001)
   - `FRONTEND_URL` - Frontend URL for CORS

## Running

```bash
# Development
pnpm dev

# Production
pnpm build
pnpm start
```

## Database

```bash
# Generate Prisma client
pnpm db:generate

# Migrations
pnpm db:migrate

# Seeds (test data)
pnpm db:seed

# Prisma Studio
pnpm db:studio
```

## API Endpoints

- `POST /auth/login` - Login
- `POST /auth/refresh` - Refresh token
- `POST /auth/logout` - Logout
- `GET /auth/me` - Current user
- `GET /users` - Users list
- `GET /incidents` - Incidents list
- `POST /incidents` - Create incident
- `GET /incidents/:id` - Incident details
- `PATCH /incidents/:id` - Update incident
- `GET /incidents/:id/comments` - Comments
- `POST /incidents/:id/comments` - Create comment
- `GET /incidents/:id/audit` - Change history
- `GET /dashboard/summary` - Statistics
- `GET /health` - Health check
- `GET /metrics` - Prometheus metrics

## Project Structure

```
src/
├── config.ts           # Configuration
├── index.ts            # Entry point
├── controllers/        # Controllers
├── services/          # Business logic
├── repositories/       # Database operations
├── routes/            # Routes
├── middleware/        # Middleware
└── lib/               # Utilities (logger, jwt, hash)
```

## Dependencies

The project uses a shared package `@incident-tracker/shared` for types and schemas. Make sure it's available in the workspace or installed separately.

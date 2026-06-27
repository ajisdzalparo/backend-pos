# Modular POS & Backoffice Backend Boilerplate

This is a modular, production-ready backend boilerplate featuring:
- **Language**: TypeScript
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database ORM**: Prisma (PostgreSQL)
- **Token Cache / Blacklist**: Redis
- **Auth Flow**: JWT Access Tokens (short-lived) + Refresh Token Rotation (stored in Redis)
- **Infrastructure**: Docker Compose (containers for Postgres and Redis only)
- **Structure**: Modular Architecture (`per-module` structure: Auth, POS, Backoffice)

---

## Architecture Structure

The project follows a **per-module design** where each directory contains its routes, controllers, services, and middlewares:

```
backend-pos/
├── prisma/
│   └── schema.prisma         # Database schema mapping (PostgreSQL)
├── src/
│   ├── config/
│   │   ├── database.ts       # Prisma client connection instance
│   │   └── redis.ts          # Redis client connection configuration
│   ├── modules/
│   │   ├── auth/             # Authentication & session token management
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.middleware.ts
│   │   │   ├── auth.routes.ts
│   │   │   ├── auth.service.ts
│   │   │   └── redis.service.ts
│   │   ├── pos/              # POS module transactions & sales logic
│   │   │   ├── pos.controller.ts
│   │   │   ├── pos.routes.ts
│   │   │   └── pos.service.ts
│   │   └── backoffice/       # Backoffice administration dashboard reports
│   │       ├── backoffice.controller.ts
│   │       ├── backoffice.routes.ts
│   │       └── backoffice.service.ts
│   ├── utils/
│   │   └── jwt.ts            # Sign/Verify utilities for JWTs
│   ├── app.ts                # Express application setup and routing imports
│   └── server.ts             # App entry point (initiates DB, cache, and HTTP server)
├── .env                      # Local configuration variables
├── docker-compose.yml        # Orchestration configuration for DB & Redis
└── tsconfig.json             # TypeScript settings
```

---

## Requirements

Ensure you have the following installed on your machine:

- Node.js (v18+)
- Docker and Docker Compose

---

## How to Get Started

### 1. Start Database & Redis (Docker)
In the project root folder (`backend-pos`), spin up PostgreSQL and Redis services:
```bash
docker-compose up -d
```
> **Note**: Postgres is configured to run on port `5435` of the host machine to prevent collisions with any existing local Postgres instances. Redis runs on standard port `6379`.

### 2. Install Project Dependencies
Run `npm install` to download and install all node packages:
```bash
npm install
```

### 3. Sync Database schema (Prisma)
Run the following to run migrations/push schema and automatically generate the Prisma client types:
```bash
npx prisma db push
```

### 4. Start Server (Development mode)
Run the application in reload-on-change dev mode:
```bash
npm run dev
```
The server will boot up and log:
```
Connecting to Redis...
Connected to Redis successfully
Connecting to PostgreSQL...
Connected to PostgreSQL successfully
Server is running on http://localhost:3000
```

---

## API Endpoints Spec

### 1. Authentication (`/api/auth`)
- **Register Account**: `POST /api/auth/register`
  - Body: `{ "email": "user@example.com", "password": "securepassword", "name": "Cashier One" }`
- **Login Session**: `POST /api/auth/login`
  - Body: `{ "email": "user@example.com", "password": "securepassword" }`
  - Response: Returns User payload, `accessToken` (JWT), and `refreshToken` (JWT).
- **Refresh Access Token**: `POST /api/auth/refresh`
  - Body: `{ "refreshToken": "<token_string>" }`
  - Response: Rotates refresh token (revokes old refresh token and generates a new access token and refresh token).
- **Verify Session (Me)**: `GET /api/auth/me`
  - Header: `Authorization: Bearer <accessToken>`
- **Logout Session**: `POST /api/auth/logout`
  - Header: `Authorization: Bearer <accessToken>`
  - Body: `{ "refreshToken": "<token_string>" }`

### 2. POS features (`/api/pos`)
- **Get Transactions List**: `GET /api/pos/transactions`
  - Header: `Authorization: Bearer <accessToken>`
- **Create Transaction Record**: `POST /api/pos/transactions`
  - Header: `Authorization: Bearer <accessToken>`
  - Body: `{ "amount": 120000, "itemsCount": 2 }`

### 3. Backoffice features (`/api/backoffice`)
- **Get Admin Reports Stats**: `GET /api/backoffice/stats`
  - Header: `Authorization: Bearer <accessToken>`

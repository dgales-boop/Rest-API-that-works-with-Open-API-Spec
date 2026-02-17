# Reportheld Read-Only API

Read-only REST API for **Sites**, **Plants**, and **Closed Protocols**.  
Built with Express 5 + TypeScript. Secured with JWT Bearer authentication.

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
# Edit .env if needed (defaults work out of the box)

# 3. Start dev server (hot reload)
npm run dev

# 4. Generate a JWT token for testing
npm run generate-token

# 5. Use the token in requests
curl -H "Authorization: Bearer <token>" http://localhost:3000/api/v1/sites
```

---

## API Endpoints

All endpoints require `Authorization: Bearer <token>` header.

| Method | Endpoint                       | Description                |
| ------ | ------------------------------ | -------------------------- |
| `GET`  | `/api/v1/sites`                | List all sites             |
| `GET`  | `/api/v1/plants`               | List all plants            |
| `GET`  | `/api/v1/protocols/closed`     | List all closed protocols  |
| `GET`  | `/api/v1/protocols/closed/:id` | Get single closed protocol |

Full spec: see [`openapi.json`](openapi.json)

---

## Authentication

The API uses **JWT Bearer tokens**. The signing secret is configured in `.env`.

```bash
# Generate a test token (valid 24h)
npm run generate-token
```

**In Swagger UI:**

1. Click **Authorize**
2. Paste the generated token (no "Bearer" prefix needed)
3. Click **Authorize** → **Close**

**In curl / Postman:**

```
Authorization: Bearer eyJhbGciOi...
```

> `JWT_SECRET` in `.env` is the **signing key** — never send it as a token.

---

## Project Structure

```
├── .env                          # Environment variables (PORT, JWT_SECRET)
├── openapi.json                  # OpenAPI 3.0.3 specification
├── package.json
├── tsconfig.json
├── scripts/
│   ├── generateToken.ts          # JWT token generator for testing
│   └── paghimo.ts                # Scaffolding tool (controller/route generator)
└── src/
    ├── App.ts                    # Express app setup, middleware, route mounting
    ├── Server.ts                 # HTTP server entry point
    ├── Config/
    │   └── index.ts              # Environment config (dotenv)
    ├── Database/
    │   └── mockData.ts           # In-memory mock data (sites, plants, protocols)
    ├── Middleware/
    │   ├── authMiddleware.ts     # JWT validation (401 on missing/invalid/expired)
    │   ├── errorHandler.ts       # Centralized error handler (500)
    │   └── notFoundHandler.ts    # 404 catch-all for unmatched routes
    ├── Models/
    │   ├── Site.ts               # Site interface
    │   ├── Plant.ts              # Plant interface
    │   └── ClosedProtocol.ts     # ClosedProtocol interface
    └── Api/
        └── V1/
            ├── Controllers/
            │   ├── Controller.ts          # Abstract base (shared response helpers)
            │   ├── SiteController.ts
            │   ├── PlantController.ts
            │   ├── ProtocolController.ts
            │   ├── UserController.ts      # (existing)
            │   └── TestController.ts      # (existing)
            ├── Services/
            │   ├── SiteService.ts
            │   ├── PlantService.ts
            │   └── ProtocolService.ts
            └── Routes/
                ├── api.ts                 # Route aggregator (mounted at /api/v1)
                ├── siteRoutes.ts
                ├── plantRoutes.ts
                ├── protocolRoutes.ts
                ├── userRoutes.ts          # (existing)
                └── testRoutes.ts          # (existing)
```

---

## Architecture

```
Request → CORS → Morgan → JSON Parser → Auth Middleware → Routes
                                                            ↓
                                                       Controller
                                                            ↓
                                                        Service
                                                            ↓
                                                     Mock Database
```

**Layers:**

- **Routes** — define endpoints, bind to controller methods
- **Controllers** — handle request/response, delegate to services
- **Services** — business logic, data access abstraction
- **Middleware** — auth, error handling, logging (reusable, composable)

---

## NPM Scripts

| Script           | Command                        | Description               |
| ---------------- | ------------------------------ | ------------------------- |
| `dev`            | `tsx watch src/Server.ts`      | Start with hot reload     |
| `start`          | `tsx src/Server.ts`            | Start without watch       |
| `generate-token` | `tsx scripts/generateToken.ts` | Generate JWT for testing  |
| `paghimo`        | `tsx scripts/paghimo.ts`       | Scaffold controller/route |

---

## Environment Variables

| Variable     | Default | Description                                 |
| ------------ | ------- | ------------------------------------------- |
| `PORT`       | `3000`  | Server port                                 |
| `JWT_SECRET` | —       | Secret key for signing/verifying JWT tokens |

---

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express 5
- **Language:** TypeScript (ESM)
- **Auth:** jsonwebtoken
- **Dev runner:** tsx (no build step needed)
- **Other:** cors, morgan, dotenv

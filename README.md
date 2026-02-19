# Protocol Snapshot API

A read-only REST API for **Closed Protocols** and their **Snapshots**, built with Express 5 + TypeScript and documented with an **OpenAPI 3.0.3 specification**.

---

## Quick Start

```bash
npm install
npm run dev          # starts at http://localhost:3000
npm run generate-token   # prints a JWT for testing with curl / Postman
```

---

## OpenAPI Specification

**File:** [`openapi.yaml`](openapi.yaml)  
**View interactively:** paste the file into [Swagger Editor](https://editor.swagger.io)

### Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/protocols/closed` | List all closed protocols |
| `GET` | `/protocols/closed/{id}` | Get a single closed protocol by ID |
| `GET` | `/protocols/closed/{id}/snapshot` | Get the full computed snapshot for a closed protocol |

> A **snapshot** is only generated for a protocol with `status: "closed"`. It contains the complete payload — topics, checklist items, computed data, and attached reports — at the time the protocol was closed.

### Schema hierarchy

```
ProtocolSnapshot
├── protocolId           string   (required)
├── powerplantId         string   (required)
├── protocolBriefcaseId  string?
├── templateName         LocalizedString   { "en": "...", "de": "..." }
├── name                 string   (required)
├── date                 integer  (Unix timestamp)
├── time                 string   HH:mm
├── status               string   default "none"
├── reportId             string?
├── owner                string   (required)
│
├── reports[]            Report
│   ├── reportId         string   (required)
│   ├── language         string   (required)
│   ├── variantName      string?
│   ├── fileName         string?
│   ├── isOld            boolean?
│   └── creationDate     integer? (Unix timestamp)
│
└── topics[]             ProtocolTopicSnapshot
    ├── name             LocalizedString   (required)
    └── items[]          ProtocolItemSnapshot
        ├── name         LocalizedString   (required)
        ├── creatorPublicParticipantId  string?
        └── data         object   (flexible key-value payload, default {})
```
---

### Security

The spec supports two ways to authorize:

| Scheme | Type | How to use |
|--------|------|------------|
| `OAuth2` | Authorization Code | Click **Authorize** in Swagger Editor — opens the mock Microsoft sign-in page |
| `BearerAuth` | JWT Bearer | Run `npm run generate-token`, paste the token into the `Authorization` header |

---


## Folder Structure

```
├── openapi.yaml                         OpenAPI 3.0.3 spec
├── entity/                              Source-of-truth entity definitions
├── mock/
│   └── protocolSnapshot.mock.json       Standalone reference mock payload
└── src/
    ├── App.ts                           Express app + middleware
    ├── Server.ts                        HTTP server entry point
    ├── Config/index.ts                  PORT, JWT_SECRET
    ├── Database/mockData.ts             In-memory mock data
    ├── Middleware/
    │   ├── authMiddleware.ts            JWT validation
    │   ├── errorHandler.ts              500 handler
    │   └── notFoundHandler.ts           404 handler
    ├── Models/                          TypeScript interfaces
    │   ├── ProtocolSnapshot.ts          LocalizedString, Report,
    │   │                                ProtocolItemSnapshot,
    │   │                                ProtocolTopicSnapshot, ProtocolSnapshot
    │   ├── ClosedProtocol.ts
    │   ├── Plant.ts
    │   └── Site.ts
    ├── OAuth/
    │   └── oauthServer.ts               Mock Microsoft OAuth2 server
    └── Api/V1/
        ├── Controllers/
        │   ├── Controller.ts            Abstract base
        │   ├── ProtocolController.ts
        │   ├── PlantController.ts
        │   └── SiteController.ts
        ├── Services/
        │   ├── ProtocolService.ts
        │   ├── PlantService.ts
        │   └── SiteService.ts
        └── Routes/
            ├── api.ts                   Mounts all routers at /api/v1
            ├── protocolRoutes.ts
            ├── plantRoutes.ts
            └── siteRoutes.ts
```

---

## Environment Variables

```env
PORT=3000
JWT_SECRET=your-secret-key-here
```

---

## Tech Stack

| | |
|---|---|
| Framework | Express 5 |
| Language | TypeScript 5 (ESM, strict) |
| API Spec | OpenAPI 3.0.3 |
| Auth | jsonwebtoken (HS256) |
| Dev runner | tsx |

# What to Put on Your Slides

Copy the content below into PowerPoint, Google Slides, or similar. One section = one slide (or two if you split). Keep slides minimal; you talk the rest.

---

## Slide 1 — Title

**Title:** Protocol Snapshot API — OpenAPI Contract

**Subtitle (optional):** REST API specification · Read-only · OpenAPI 3.0

**Footer (optional):** Your names · Friday [date]

---

## Slide 2 — What we’re covering

**Title:** Agenda

**Bullets:**
- What the API does (read-only, endpoints)
- What’s in the spec (paths, schemas, security)
- How we use the spec
- What’s next (auth, open points)

---

## Slide 3 — What the API does

**Title:** Read-only API

**Bullets:**
- We only **retrieve** closed protocols and their snapshots
- No create, update, or delete (no POST / PUT / PATCH)
- Snapshot = full computed payload (topics, items, reports) for a closed protocol

---

## Slide 4 — Endpoints

**Title:** Endpoints

**Table (or three bullets):**

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/protocols/closed` | List all closed protocols |
| GET | `/protocols/closed/{id}` | Get one closed protocol |
| GET | `/protocols/closed/{id}/snapshot` | Get snapshot for that protocol |

**Optional one-liner under table:** Base URL example: `http://localhost:3000/api/v1`

---

## Slide 5 — Snapshot behaviour

**Title:** Snapshot endpoint behaviour

**Bullets:**
- Protocol must already be **closed**
- Snapshot must **already exist**
- Returns **404** if not closed or no snapshot
- **No generation** on this endpoint — we only return existing data

---

## Slide 6 — What’s in the spec (paths)

**Title:** Spec structure — Paths

**Bullets:**
- Each path has: summary, description, parameters, responses
- Responses: 200 (success), 401 (Unauthorized), 403 (Forbidden), 404 (Not found)
- Example: `GET /protocols/closed/{id}/snapshot` → 200 returns **ProtocolSnapshot** schema

**Optional:** “We’ll show the live spec in Swagger Editor next.”

---

## Slide 7 — What’s in the spec (schemas)

**Title:** Spec structure — Schemas

**Bullets:**
- **ProtocolSnapshot** — root (protocolId, powerplantId, templateName, name, owner, date, time, status, reportId, reports, topics)
- **ProtocolTopicSnapshot** — name + items[]
- **ProtocolItemSnapshot** — name, creatorPublicParticipantId, data
- **Report** — reportId, language, variantName, fileName, isOld, creationDate

**Optional one-liner:** Aligned with entity definitions (e.g. protocolSnapshot.json).

---

## Slide 8 — Security (placeholder)

**Title:** Security in the spec

**Bullets:**
- **OAuth2** (Authorization Code) — placeholder
- **BearerAuth** (JWT) — placeholder
- Auth is **not final** — we’ll align with backend (e.g. Heiko) and then update URLs/scopes in the spec
- Spec describes **what** we expect at the contract level

---

## Slide 9 — How we use the spec

**Title:** How we use the spec

**Bullets:**
- **Single source of truth** for the API contract
- **Generate docs** (e.g. Swagger UI) so others can see the API
- **Align frontend/backend** — request/response shapes come from the spec
- **Mock or test** — run a mock server or tests against the same contract
- Entity definitions (e.g. `entity/protocolSnapshot.json`) stay in sync with the spec

---

## Slide 10 — What’s next

**Title:** What’s next

**Bullets:**
- **Auth:** Finalise OAuth flow and JWT with backend; update spec (URLs, scopes, descriptions)
- **Implementation:** Implement endpoints and responses to match the spec
- **Keep in sync:** Entities and OpenAPI schemas stay aligned when fields change

---

## Slide 11 — Summary

**Title:** Summary

**Bullets:**
- Read-only Protocol Snapshot API contract in **OpenAPI 3.0** (`openapi.yaml`)
- Three GET endpoints: list closed protocols, get one, get its snapshot
- Schemas match our entity definitions; security is placeholder until backend alignment
- Spec is the single source of truth for docs, alignment, and testing

---

## Slide 12 — Thank you / Q&A

**Title:** Thank you

**Subtitle:** Questions?

**Optional:** Link to repo or spec: `openapi.yaml` · Swagger Editor: editor.swagger.io

---

## Quick reference — minimum set

If you need fewer slides, keep at least:

1. Title  
2. Endpoints (table)  
3. Snapshot behaviour (404, no generation)  
4. Schemas (ProtocolSnapshot → topics → items, reports)  
5. Security = placeholder  
6. What’s next  
7. Thank you / Q&A  

That’s 7 slides. Use the full set above if you have more time.

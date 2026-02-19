# OpenAPI Spec — Friday Presentation Flow

A simple flow for presenting the Protocol Snapshot API contract as a team. Adjust timings and who speaks to fit your slot.

---

## 1. Opening (1–2 min)

**Who:** Either person  

**Say:**
- We’re presenting our **REST API contract** for the Protocol Snapshot API.
- The contract is defined in **OpenAPI 3.0** (`openapi.yaml`).
- Today we’ll walk through **what’s in the spec**, **how we use it**, and **what’s still open** (e.g. auth).

**Show:** Title slide or repo name + `openapi.yaml`.

---

## 2. What the API does (2–3 min)

**Who:** Person A  

**Say:**
- The API is **read-only**: we only **retrieve** closed protocols and their snapshots.
- We do **not** create or update anything; no POST/PUT/PATCH.

**Show:** List of endpoints (from the spec):

| Method | Path | Purpose |
|--------|------|--------|
| GET | `/protocols/closed` | List all closed protocols |
| GET | `/protocols/closed/{id}` | Get one closed protocol |
| GET | `/protocols/closed/{id}/snapshot` | Get the snapshot for that protocol |

**Optional:** One sentence each — e.g. “Snapshot is the full computed payload (topics, items, reports) that exists only after a protocol is closed.”

---

## 3. Walking through the spec (5–7 min)

**Who:** Split: Person A = paths + responses, Person B = schemas + security.

### Person A — Paths and responses

**Do:**
- Open `openapi.yaml` (or Swagger Editor with the spec loaded).
- Go to **Paths** and click one path, e.g. `GET /protocols/closed/{id}/snapshot`.
- Briefly show:
  - **Summary** and **description**
  - **Parameters** (e.g. `id`)
  - **Responses**: 200 (body = ProtocolSnapshot), 401, 403, 404.
- Say: “The snapshot endpoint returns 404 if the protocol isn’t closed or the snapshot doesn’t exist — we only return an **existing** snapshot.”

### Person B — Schemas and security

**Do:**
- In the same spec, go to **Components → Schemas**.
- Show the hierarchy in one sentence:
  - **ProtocolSnapshot** is the root (protocolId, powerplantId, templateName, name, owner, date, time, status, reportId, reports, topics).
  - **topics** are **ProtocolTopicSnapshot** (name + items).
  - **items** are **ProtocolItemSnapshot** (name, creatorPublicParticipantId, data).
  - **reports** are **Report** (reportId, language, variantName, fileName, isOld, creationDate).
- Scroll to **Security schemes**:
  - We have **OAuth2** (Authorization Code) and **BearerAuth** (JWT).
  - Say: “Auth is still a placeholder until we align with the backend; the spec describes **what** we expect, not the final implementation.”

**Tip:** If you use Swagger Editor, “Try it out” on one GET to show a sample response.

---

## 4. How we use the spec (2–3 min)

**Who:** Person B (or alternate)  

**Say:**
- The spec is the **single source of truth** for the contract.
- We use it to:
  - **Generate docs** (e.g. Swagger UI) so others can see the API.
  - **Align frontend/backend**: request/response shapes come from the spec.
  - **Mock or test**: we can run a mock server or write tests against the same contract.
- Entity definitions (e.g. `entity/protocolSnapshot.json`) align with the spec so the contract matches our domain model.

**Show:** (optional) Screenshot of Swagger UI or a one-line “we load openapi.yaml into Swagger Editor / our tooling”.

---

## 5. What’s next / open points (1–2 min)

**Who:** Person A  

**Say:**
- **Auth:** OAuth2 and Bearer are placeholders; we’ll align with [e.g. Heiko/backend] on the real flow and then update only URLs/scopes/descriptions in the spec.
- **Snapshot behavior:** The spec already states that we only return an existing snapshot (no generation on this endpoint); we’ll keep that in mind when implementing.
- Any other open point you have (e.g. base URL, error body format).

**Show:** Short bullet list: “Next: finalise auth, implement against spec, keep entities and spec in sync.”

---

## 6. Closing (1 min)

**Who:** Either person  

**Say:**
- Summary: “We have a read-only OpenAPI contract for closed protocols and their snapshots, with clear paths, schemas, and placeholder security. We’ll refine auth once the backend is agreed.”
- Thank the audience and open for questions.

---

## Checklist before Friday

- [ ] Decide who presents which part (Paths vs Schemas/Security, etc.).
- [ ] Have `openapi.yaml` open in Swagger Editor (or another viewer) so you can click through live.
- [ ] One slide or doc with the three endpoints (table above) for quick reference.
- [ ] One slide or bullet list for “What’s next” so you don’t forget.
- [ ] Rehearse once with your partner and a timer.

---

## Short “cheat sheet” for the audience

If you hand out a one-pager or leave it in the chat:

**Protocol Snapshot API — Contract summary**

- **Spec:** `openapi.yaml` (OpenAPI 3.0.3)
- **Base URL:** `http://localhost:3000/api/v1` (example)
- **Endpoints:** GET `/protocols/closed`, GET `/protocols/closed/{id}`, GET `/protocols/closed/{id}/snapshot`
- **Auth:** Placeholder (OAuth2 + JWT Bearer) until backend alignment
- **Behaviour:** Read-only; snapshot endpoint returns an existing snapshot only (404 otherwise)

That’s the flow: opening → what the API does → walk through spec (paths + schemas + security) → how you use it → what’s next → closing.

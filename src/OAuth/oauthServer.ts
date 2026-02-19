import { Router } from "express";
import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import config from "../Config/index";

const router = Router();

// ─── Mock tenant / app constants ──────────────────────────────────────────────

const MOCK_TENANT_ID = "f8cdef18-a0e5-4d01-b7c7-contoso00001";
const MOCK_CLIENT_ID = "3075e469-8ff9-4b23-a0a5-contosoapp01";
const BASE_URL = "http://localhost:3000";
const APP_NAME = "Protocol Snapshot API";

// ─── In-memory token stores ───────────────────────────────────────────────────

interface AuthCodeEntry {
  clientId: string;
  redirectUri: string;
  scope: string;
  userId: string;
  email: string;
  displayName: string;
  codeChallenge?: string;
  codeChallengeMethod?: string;
  nonce?: string;
  expiresAt: number;
}

interface RefreshTokenEntry {
  clientId: string;
  scope: string;
  userId: string;
  email: string;
  displayName: string;
  expiresAt: number;
}

const authCodeStore = new Map<string, AuthCodeEntry>();
const refreshTokenStore = new Map<string, RefreshTokenEntry>();

// ─── Mock user directory ──────────────────────────────────────────────────────

interface MockUser {
  oid: string;
  displayName: string;
  upn: string;
  email: string;
  department: string;
  jobTitle: string;
  roles: string[];
}

const MOCK_USERS: Record<string, MockUser> = {
  "john.doe@contoso.com": {
    oid: "a1b2c3d4-e5f6-7890-abcd-000000000001",
    displayName: "John Doe",
    upn: "john.doe@contoso.com",
    email: "john.doe@contoso.com",
    department: "Engineering",
    jobTitle: "Inspector",
    roles: ["Protocol.Read"],
  },
  "jane.smith@contoso.com": {
    oid: "a1b2c3d4-e5f6-7890-abcd-000000000002",
    displayName: "Jane Smith",
    upn: "jane.smith@contoso.com",
    email: "jane.smith@contoso.com",
    department: "Quality Assurance",
    jobTitle: "Senior Auditor",
    roles: ["Protocol.Read", "Protocol.Admin"],
  },
  "admin@contoso.onmicrosoft.com": {
    oid: "a1b2c3d4-e5f6-7890-abcd-000000000003",
    displayName: "Contoso Admin",
    upn: "admin@contoso.onmicrosoft.com",
    email: "admin@contoso.onmicrosoft.com",
    department: "IT",
    jobTitle: "Global Administrator",
    roles: ["Protocol.Read", "Protocol.Admin", "GlobalAdmin"],
  },
};

/** Resolve a known user or synthesise a generic one from the email address. */
function resolveUser(email: string): MockUser {
  const known = MOCK_USERS[email.toLowerCase()];
  if (known) return known;

  const namePart = email.split("@")[0] ?? email;
  const displayName = namePart
    .split(/[._-]/)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");

  return {
    oid: deterministicOid(email),
    displayName,
    upn: email,
    email,
    department: "Unknown",
    jobTitle: "User",
    roles: ["Protocol.Read"],
  };
}

/** Produce a deterministic UUID-shaped OID from an email (dev only). */
function deterministicOid(seed: string): string {
  const h = crypto.createHash("sha256").update(seed).digest("hex");
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-4${h.slice(13, 16)}-${h.slice(16, 20)}-${h.slice(20, 32)}`;
}

// ─── Utilities ────────────────────────────────────────────────────────────────

function randomToken(bytes = 40): string {
  return crypto.randomBytes(bytes).toString("base64url");
}

/** RFC 4122 v4 UUID without relying on crypto.randomUUID */
function newUuid(): string {
  const b = crypto.randomBytes(16);
  b[6] = ((b[6] ?? 0) & 0x0f) | 0x40;
  b[8] = ((b[8] ?? 0) & 0x3f) | 0x80;
  const h = b.toString("hex");
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

/**
 * Produce a Microsoft-style error response body.
 * https://learn.microsoft.com/en-us/azure/active-directory/develop/reference-aadsts-error-codes
 */
function msError(
  error: string,
  description: string,
  code = 90000,
): Record<string, unknown> {
  const traceId = newUuid();
  const correlationId = newUuid();
  return {
    error,
    error_description:
      `AADSTS${code}: ${description}\r\n` +
      `Trace ID: ${traceId}\r\n` +
      `Correlation ID: ${correlationId}\r\n` +
      `Timestamp: ${new Date().toISOString()}`,
    error_codes: [code],
    timestamp: new Date().toISOString(),
    trace_id: traceId,
    correlation_id: correlationId,
  };
}

/** Verify a PKCE code_verifier against the stored code_challenge. */
function verifyPkce(verifier: string, challenge: string, method: string): boolean {
  if (method === "S256") {
    const hash = crypto.createHash("sha256").update(verifier).digest("base64url");
    return hash === challenge;
  }
  return verifier === challenge; // plain
}

// ─── JWT builders ─────────────────────────────────────────────────────────────

function buildAccessToken(
  user: MockUser,
  scope: string,
  clientId: string,
  nonce?: string,
): string {
  const scp = scope
    .split(" ")
    .filter((s) => !["openid", "profile", "email", "offline_access"].includes(s))
    .join(" ");

  return jwt.sign(
    {
      ver: "2.0",
      iss: `${BASE_URL}/oauth/${MOCK_TENANT_ID}/v2.0`,
      sub: user.oid,
      aud: clientId,
      oid: user.oid,
      tid: MOCK_TENANT_ID,
      upn: user.upn,
      preferred_username: user.upn,
      name: user.displayName,
      email: user.email,
      scp,
      roles: user.roles,
      appid: clientId,
      azp: clientId,
      ...(nonce ? { nonce } : {}),
    },
    config.jwtSecret,
    { expiresIn: "1h", algorithm: "HS256" },
  );
}

function buildIdToken(
  user: MockUser,
  scope: string,
  clientId: string,
  nonce?: string,
): string {
  void scope;
  return jwt.sign(
    {
      ver: "2.0",
      iss: `${BASE_URL}/oauth/${MOCK_TENANT_ID}/v2.0`,
      sub: user.oid,
      aud: clientId,
      oid: user.oid,
      tid: MOCK_TENANT_ID,
      preferred_username: user.upn,
      name: user.displayName,
      email: user.email,
      ...(nonce ? { nonce } : {}),
    },
    config.jwtSecret,
    { expiresIn: "1h", algorithm: "HS256" },
  );
}

// ─── Grant handlers ───────────────────────────────────────────────────────────

function handleAuthCodeGrant(
  res: Response,
  p: { code: string | undefined; redirectUri: string | undefined; clientId: string | undefined; codeVerifier: string | undefined },
): void {
  if (!p.code) {
    res.status(400).json(msError("invalid_request", "The 'code' parameter is required.", 90014));
    return;
  }

  const stored = authCodeStore.get(p.code);
  authCodeStore.delete(p.code); // one-time use

  if (!stored) {
    res.status(400).json(
      msError("invalid_grant", "The authorization code is invalid, expired, or has already been redeemed.", 70008),
    );
    return;
  }

  if (Date.now() > stored.expiresAt) {
    res.status(400).json(msError("invalid_grant", "The authorization code has expired.", 70008));
    return;
  }

  if (stored.codeChallenge && p.codeVerifier) {
    if (!verifyPkce(p.codeVerifier, stored.codeChallenge, stored.codeChallengeMethod ?? "S256")) {
      res.status(400).json(msError("invalid_grant", "PKCE code_verifier does not match code_challenge.", 70011));
      return;
    }
  }

  const user = resolveUser(stored.email);
  const accessToken = buildAccessToken(user, stored.scope, stored.clientId, stored.nonce);
  const idToken = buildIdToken(user, stored.scope, stored.clientId, stored.nonce);
  const refreshToken = randomToken(60);

  refreshTokenStore.set(refreshToken, {
    clientId: stored.clientId,
    scope: stored.scope,
    userId: stored.userId,
    email: stored.email,
    displayName: stored.displayName,
    expiresAt: Date.now() + 90 * 24 * 60 * 60 * 1000, // 90 days
  });

  res.json({
    token_type: "Bearer",
    scope: stored.scope,
    expires_in: 3600,
    ext_expires_in: 3600,
    access_token: accessToken,
    refresh_token: refreshToken,
    id_token: idToken,
  });
}

function handleRefreshTokenGrant(
  res: Response,
  p: { refreshToken: string | undefined; clientId: string | undefined },
): void {
  if (!p.refreshToken) {
    res.status(400).json(msError("invalid_request", "The 'refresh_token' parameter is required.", 90014));
    return;
  }

  const stored = refreshTokenStore.get(p.refreshToken);

  if (!stored) {
    res.status(400).json(
      msError("invalid_grant", "The refresh token is invalid or has already been used.", 70008),
    );
    return;
  }

  if (Date.now() > stored.expiresAt) {
    refreshTokenStore.delete(p.refreshToken);
    res.status(400).json(
      msError("invalid_grant", "The refresh token has expired. The user must sign in again.", 70008),
    );
    return;
  }

  // Rotate: delete the old token and issue a new one
  refreshTokenStore.delete(p.refreshToken);
  const newRefreshToken = randomToken(60);
  const user = resolveUser(stored.email);
  const accessToken = buildAccessToken(user, stored.scope, stored.clientId);
  const idToken = buildIdToken(user, stored.scope, stored.clientId);

  refreshTokenStore.set(newRefreshToken, {
    ...stored,
    expiresAt: Date.now() + 90 * 24 * 60 * 60 * 1000,
  });

  res.json({
    token_type: "Bearer",
    scope: stored.scope,
    expires_in: 3600,
    ext_expires_in: 3600,
    access_token: accessToken,
    refresh_token: newRefreshToken,
    id_token: idToken,
  });
}

function handleClientCredentialsGrant(
  res: Response,
  p: { clientId: string | undefined; clientSecret: string | undefined },
): void {
  if (!p.clientId || !p.clientSecret) {
    res.status(401).json(
      msError("invalid_client", "client_id and client_secret are required for client_credentials grant.", 70011),
    );
    return;
  }

  const servicePrincipal: MockUser = {
    oid: deterministicOid(p.clientId),
    displayName: "Service Principal",
    upn: `${p.clientId}@contoso.onmicrosoft.com`,
    email: `${p.clientId}@contoso.onmicrosoft.com`,
    department: "Automation",
    jobTitle: "Service Account",
    roles: ["Protocol.Read"],
  };

  const accessToken = buildAccessToken(servicePrincipal, "protocol.read", p.clientId);

  res.json({
    token_type: "Bearer",
    expires_in: 3600,
    ext_expires_in: 3600,
    access_token: accessToken,
  });
}

// ─── Routes ───────────────────────────────────────────────────────────────────

/**
 * OIDC Discovery document.
 * Mirrors the Azure AD v2.0 metadata endpoint structure.
 * GET /oauth/{tenantId}/v2.0/.well-known/openid-configuration
 */
router.get("/:tenantId/v2.0/.well-known/openid-configuration", (req: Request, res: Response): void => {
  const { tenantId } = req.params;
  const base = `${BASE_URL}/oauth/${tenantId}/v2.0`;

  res.json({
    issuer: base,
    authorization_endpoint: `${base}/authorize`,
    token_endpoint: `${base}/token`,
    userinfo_endpoint: `${base}/userinfo`,
    jwks_uri: `${base}/keys`,
    response_types_supported: ["code", "id_token", "code id_token"],
    response_modes_supported: ["query", "fragment", "form_post"],
    subject_types_supported: ["pairwise"],
    id_token_signing_alg_values_supported: ["RS256"],
    scopes_supported: ["openid", "profile", "email", "offline_access", "protocol.read"],
    token_endpoint_auth_methods_supported: [
      "client_secret_post",
      "client_secret_basic",
      "private_key_jwt",
    ],
    claims_supported: [
      "sub", "iss", "aud", "exp", "iat", "nbf",
      "name", "preferred_username", "email",
      "oid", "tid", "upn", "scp", "roles",
      "appid", "azp", "ver",
    ],
    grant_types_supported: ["authorization_code", "refresh_token", "client_credentials"],
    code_challenge_methods_supported: ["S256", "plain"],
    tenant_region_scope: "EU",
    cloud_instance_name: "microsoftonline.com",
    msgraph_host: "graph.microsoft.com",
  });
});

/**
 * Userinfo endpoint (OIDC).
 * GET /oauth/{tenantId}/v2.0/userinfo
 */
router.get("/:tenantId/v2.0/userinfo", (req: Request, res: Response): void => {
  const auth = req.headers.authorization;

  if (!auth?.startsWith("Bearer ")) {
    res.status(401).json(msError("invalid_token", "Authorization header is missing or invalid.", 70011));
    return;
  }

  try {
    const payload = jwt.verify(auth.slice(7), config.jwtSecret) as jwt.JwtPayload;
    res.json({
      sub: payload["sub"],
      name: payload["name"],
      preferred_username: payload["preferred_username"],
      email: payload["email"],
      oid: payload["oid"],
      tid: payload["tid"],
    });
  } catch {
    res.status(401).json(msError("invalid_token", "The access token is invalid or expired.", 70011));
  }
});

/**
 * Authorization endpoint — renders the Microsoft-style sign-in page.
 * GET /oauth/authorize  (legacy, used by openapi.yaml)
 * GET /oauth/{tenantId}/v2.0/authorize
 */
router.get(["/authorize", "/:tenantId/v2.0/authorize"], (req: Request, res: Response): void => {
  const q = req.query as Record<string, string | undefined>;

  if (q["response_type"] && !q["response_type"].includes("code")) {
    res.status(400).json(
      msError("unsupported_response_type", "response_type must include 'code'.", 70007),
    );
    return;
  }

  res.setHeader("Content-Type", "text/html");
  res.send(buildLoginPage(q));
});

/**
 * Authorization endpoint — processes the sign-in form and issues an auth code.
 * POST /oauth/authorize
 * POST /oauth/{tenantId}/v2.0/authorize
 */
router.post(["/authorize", "/:tenantId/v2.0/authorize"], (req: Request, res: Response): void => {
  const body = req.body as Record<string, string | undefined>;
  const { client_id, redirect_uri, scope, state, nonce, email, code_challenge, code_challenge_method } = body;

  if (!redirect_uri) {
    res.status(400).json(msError("invalid_request", "redirect_uri is required.", 90014));
    return;
  }

  if (!email) {
    res.status(400).json(msError("invalid_request", "email is required.", 90014));
    return;
  }

  const user = resolveUser(email);
  const code = randomToken(32);

  authCodeStore.set(code, {
    clientId: client_id ?? MOCK_CLIENT_ID,
    redirectUri: redirect_uri,
    scope: scope ?? "openid profile protocol.read",
    userId: user.oid,
    email,
    displayName: user.displayName,
    ...(code_challenge !== undefined ? { codeChallenge: code_challenge } : {}),
    ...(code_challenge_method !== undefined ? { codeChallengeMethod: code_challenge_method } : {}),
    ...(nonce !== undefined ? { nonce } : {}),
    expiresAt: Date.now() + 5 * 60 * 1000,
  });

  const url = new URL(redirect_uri);
  url.searchParams.set("code", code);
  if (state) url.searchParams.set("state", state);

  res.redirect(url.toString());
});

/**
 * Token endpoint — exchanges a code or refresh token for access/id tokens.
 * POST /oauth/token
 * POST /oauth/{tenantId}/v2.0/token
 */
router.post(["/token", "/:tenantId/v2.0/token"], (req: Request, res: Response): void => {
  const body = req.body as Record<string, string | undefined>;

  switch (body["grant_type"]) {
    case "authorization_code":
      handleAuthCodeGrant(res, {
        code: body["code"],
        redirectUri: body["redirect_uri"],
        clientId: body["client_id"],
        codeVerifier: body["code_verifier"],
      });
      break;

    case "refresh_token":
      handleRefreshTokenGrant(res, {
        refreshToken: body["refresh_token"],
        clientId: body["client_id"],
      });
      break;

    case "client_credentials":
      handleClientCredentialsGrant(res, {
        clientId: body["client_id"],
        clientSecret: body["client_secret"],
      });
      break;

    default:
      res.status(400).json(
        msError(
          "unsupported_grant_type",
          `The grant type '${body["grant_type"] ?? "(none)"}' is not supported.`,
          70003,
        ),
      );
  }
});

// ─── HTML login page ──────────────────────────────────────────────────────────

function safeAttr(v: string | undefined): string {
  return (v ?? "").replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

function buildLoginPage(q: Record<string, string | undefined>): string {
  const {
    client_id, redirect_uri, scope, state,
    nonce, login_hint, code_challenge, code_challenge_method,
  } = q;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Sign in to your account</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { height: 100%; }
    body {
      font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif;
      font-size: 15px;
      color: #1b1b1b;
      background: #f2f2f2;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
    }
    .container {
      background: #fff;
      width: 440px;
      max-width: 100vw;
      padding: 44px;
      box-shadow: 0 2px 6px rgba(0,0,0,.08), 0 0 0 1px rgba(0,0,0,.04);
    }
    .ms-logo {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 32px;
    }
    .ms-logo svg { width: 24px; height: 24px; flex-shrink: 0; }
    .ms-logo-text { font-size: 20px; font-weight: 600; color: #1b1b1b; letter-spacing: -0.3px; }
    h1 { font-size: 24px; font-weight: 600; margin-bottom: 8px; color: #1b1b1b; }
    .subtitle { font-size: 13px; color: #444; margin-bottom: 24px; }
    .subtitle strong { color: #0078d4; }
    .step { display: none; }
    .step.active { display: block; }
    label { display: block; font-size: 13px; font-weight: 600; color: #1b1b1b; margin-bottom: 5px; }
    input[type="email"],
    input[type="password"],
    input[type="text"] {
      width: 100%;
      padding: 6px 10px;
      border: 1px solid #666;
      border-radius: 0;
      font-size: 15px;
      font-family: inherit;
      outline: none;
      height: 36px;
      margin-bottom: 6px;
      transition: border-color .1s;
    }
    input:focus { border-color: #0078d4; box-shadow: 0 0 0 1px #0078d4 inset; }
    .link { font-size: 13px; color: #0067b8; text-decoration: none; display: block; margin-bottom: 22px; }
    .link:hover { text-decoration: underline; }
    .btn-primary {
      display: block;
      width: 108px;
      margin-left: auto;
      padding: 5px 12px;
      background: #0078d4;
      color: #fff;
      border: none;
      border-radius: 0;
      font-size: 15px;
      font-family: inherit;
      cursor: pointer;
      height: 32px;
    }
    .btn-primary:hover { background: #106ebe; }
    .user-chip {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 14px;
      border: 1px solid #d2d2d2;
      margin-bottom: 20px;
      cursor: pointer;
    }
    .user-chip:hover { background: #f5f5f5; }
    .avatar {
      width: 36px; height: 36px;
      background: #0078d4;
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      color: #fff; font-weight: 600; font-size: 15px;
      flex-shrink: 0;
    }
    .user-info .name  { font-size: 14px; font-weight: 600; }
    .user-info .email { font-size: 13px; color: #444; }
    .btn-back {
      display: flex; align-items: center; gap: 6px;
      color: #0067b8; font-size: 13px;
      background: none; border: none;
      cursor: pointer; margin-bottom: 20px; padding: 0;
      font-family: inherit;
    }
    .btn-back:hover { text-decoration: underline; }
    .btn-back svg { width: 10px; height: 10px; }
    .divider { border: none; border-top: 1px solid #e6e6e6; margin: 20px 0; }
    .error-msg {
      background: #fde7e9;
      border-left: 3px solid #d93025;
      padding: 8px 12px;
      font-size: 13px;
      color: #a4000f;
      margin-bottom: 14px;
      display: none;
    }
    .error-msg.show { display: block; }
    .dev-hint {
      margin-top: 18px;
      padding: 10px 12px;
      background: #dff0ff;
      border-left: 3px solid #0078d4;
      font-size: 12px;
      color: #004e8c;
      line-height: 1.5;
    }
    .footer { margin-top: 24px; font-size: 12px; color: #767676; display: flex; gap: 12px; }
    .footer a { color: #767676; text-decoration: none; }
    .footer a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">

    <div class="ms-logo">
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect x="1"  y="1"  width="10" height="10" fill="#f25022"/>
        <rect x="13" y="1"  width="10" height="10" fill="#7fba00"/>
        <rect x="1"  y="13" width="10" height="10" fill="#00a4ef"/>
        <rect x="13" y="13" width="10" height="10" fill="#ffb900"/>
      </svg>
      <span class="ms-logo-text">Microsoft</span>
    </div>

    <form method="POST" action="/oauth/authorize" id="authForm">
      <input type="hidden" name="client_id"             value="${safeAttr(client_id)}" />
      <input type="hidden" name="redirect_uri"          value="${safeAttr(redirect_uri)}" />
      <input type="hidden" name="scope"                 value="${safeAttr(scope)}" />
      <input type="hidden" name="state"                 value="${safeAttr(state)}" />
      <input type="hidden" name="nonce"                 value="${safeAttr(nonce)}" />
      <input type="hidden" name="code_challenge"        value="${safeAttr(code_challenge)}" />
      <input type="hidden" name="code_challenge_method" value="${safeAttr(code_challenge_method)}" />
      <input type="hidden" name="email"                 id="hiddenEmail" />

      <!-- ── Step 1: email ── -->
      <div class="step active" id="step1">
        <h1>Sign in</h1>
        <p class="subtitle">to continue to <strong>${APP_NAME}</strong></p>
        <div class="error-msg" id="emailError">Enter a valid email address.</div>
        <label for="emailInput">Email, phone, or Skype</label>
        <input type="email" id="emailInput" autocomplete="username"
               value="${safeAttr(login_hint)}" autofocus />
        <a href="#" class="link">No account? Create one!</a>
        <hr class="divider" />
        <button type="button" class="btn-primary" id="btnNext">Next</button>
      </div>

      <!-- ── Step 2: password ── -->
      <div class="step" id="step2">
        <button type="button" class="btn-back" id="btnBack">
          <svg viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M7 1L3 5l4 4" stroke="currentColor" stroke-width="1.5"
                  fill="none" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Back
        </button>
        <h1>Enter password</h1>
        <div class="user-chip" id="userChip">
          <div class="avatar" id="avatarInitial">?</div>
          <div class="user-info">
            <div class="name"  id="chipName"></div>
            <div class="email" id="chipEmail"></div>
          </div>
        </div>
        <label for="passwordInput">Password</label>
        <input type="password" id="passwordInput" name="password"
               autocomplete="current-password" />
        <a href="#" class="link">Forgot my password</a>
        <button type="submit" class="btn-primary">Sign in</button>
        <div class="dev-hint">
          <strong>Mock OAuth2 (dev mode)</strong><br/>
          Any password is accepted. Pre-defined users:<br/>
          <code>john.doe@contoso.com</code>&nbsp;&nbsp;
          <code>jane.smith@contoso.com</code>&nbsp;&nbsp;
          <code>admin@contoso.onmicrosoft.com</code>
        </div>
      </div>
    </form>

    <div class="footer">
      <a href="#">Terms of use</a>
      <a href="#">Privacy &amp; cookies</a>
      <a href="#">&#x2026;</a>
    </div>
  </div>

  <script>
    (function () {
      var emailInput = document.getElementById('emailInput');
      var passwordInput = document.getElementById('passwordInput');
      var hiddenEmail = document.getElementById('hiddenEmail');
      var emailError = document.getElementById('emailError');
      var chipName = document.getElementById('chipName');
      var chipEmail = document.getElementById('chipEmail');
      var avatarInitial = document.getElementById('avatarInitial');
      var step1 = document.getElementById('step1');
      var step2 = document.getElementById('step2');

      function toStep2() {
        var email = emailInput.value.trim();
        if (!email || email.indexOf('@') < 1) {
          emailError.classList.add('show');
          return;
        }
        emailError.classList.remove('show');
        hiddenEmail.value = email;
        chipEmail.textContent = email;
        var parts = email.split('@')[0].split(/[._-]/);
        var name = parts.map(function(p){ return p.charAt(0).toUpperCase() + p.slice(1); }).join(' ');
        chipName.textContent = name;
        avatarInitial.textContent = name.charAt(0).toUpperCase();
        step1.classList.remove('active');
        step2.classList.add('active');
        passwordInput.focus();
      }

      function toStep1() {
        step2.classList.remove('active');
        step1.classList.add('active');
        emailInput.focus();
      }

      document.getElementById('btnNext').addEventListener('click', toStep2);
      document.getElementById('btnBack').addEventListener('click', toStep1);
      document.getElementById('userChip').addEventListener('click', toStep1);
      emailInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') { e.preventDefault(); toStep2(); }
      });
    }());
  </script>
</body>
</html>`;
}

export default router;

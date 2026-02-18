import { Router } from "express";
import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "../Config/index";

const router = Router();

/**
 * In-memory store for authorization codes.
 * Maps code -> { clientId, redirectUri, scope, expiresAt }
 */
const authCodes = new Map<
  string,
  {
    clientId: string;
    redirectUri: string;
    scope: string;
    expiresAt: number;
  }
>();

/** Generate a random string for auth codes. */
function randomCode(length = 32): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * GET /oauth/authorize
 *
 * Swagger Editor redirects here when the user clicks "Authorize" for OAuth2.
 * Shows a simple HTML login page. On submit, issues an authorization code
 * and redirects back to Swagger Editor's redirect_uri.
 */
router.get("/authorize", (req: Request, res: Response): void => {
  const { response_type, client_id, redirect_uri, scope, state } =
    req.query as Record<string, string | undefined>;

  if (response_type !== "code") {
    res.status(400).json({ error: "Only response_type=code is supported" });
    return;
  }

  // Render a simple login page
  res.setHeader("Content-Type", "text/html");
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mock OAuth2 Login</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f0f2f5;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
    }
    .card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 16px rgba(0,0,0,0.1);
      padding: 40px;
      width: 400px;
      max-width: 90vw;
    }
    h2 { margin-bottom: 8px; color: #1a1a1a; }
    .subtitle { color: #666; font-size: 14px; margin-bottom: 24px; }
    .scope-badge {
      display: inline-block;
      background: #e8f4fd;
      color: #0277bd;
      padding: 4px 12px;
      border-radius: 16px;
      font-size: 13px;
      margin-bottom: 20px;
    }
    label { display: block; font-weight: 500; margin-bottom: 6px; color: #333; }
    input[type="text"], input[type="password"] {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-size: 14px;
      margin-bottom: 16px;
      outline: none;
    }
    input:focus { border-color: #4285f4; box-shadow: 0 0 0 2px rgba(66,133,244,0.2); }
    button {
      width: 100%;
      padding: 12px;
      background: #4285f4;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
    }
    button:hover { background: #3367d6; }
    .info {
      margin-top: 16px;
      padding: 12px;
      background: #fff3e0;
      border-radius: 8px;
      font-size: 12px;
      color: #e65100;
    }
  </style>
</head>
<body>
  <div class="card">
    <h2>Mock OAuth2 Login</h2>
    <p class="subtitle">Protocol Snapshot API is requesting access</p>
    <div class="scope-badge">Scope: ${scope || "protocol.read"}</div>
    <form method="POST" action="/oauth/authorize">
      <input type="hidden" name="client_id" value="${client_id || ""}" />
      <input type="hidden" name="redirect_uri" value="${redirect_uri || ""}" />
      <input type="hidden" name="scope" value="${scope || ""}" />
      <input type="hidden" name="state" value="${state || ""}" />
      <label for="username">Username</label>
      <input type="text" id="username" name="username" placeholder="Any username" value="demo-user" />
      <label for="password">Password</label>
      <input type="password" id="password" name="password" placeholder="Any password" value="demo" />
      <button type="submit">Authorize</button>
    </form>
    <div class="info">
      This is a <strong>mock OAuth2 server</strong> for development.
      Any username/password will be accepted.
    </div>
  </div>
</body>
</html>
  `);
});

/**
 * POST /oauth/authorize
 *
 * Processes the login form, generates an authorization code,
 * and redirects back to the client's redirect_uri.
 */
router.post("/authorize", (req: Request, res: Response): void => {
  const { client_id, redirect_uri, scope, state } = req.body as Record<
    string,
    string | undefined
  >;

  if (!redirect_uri) {
    res.status(400).json({ error: "redirect_uri is required" });
    return;
  }

  // Generate authorization code
  const code = randomCode();
  authCodes.set(code, {
    clientId: client_id || "swagger-editor",
    redirectUri: redirect_uri,
    scope: scope || "protocol.read",
    expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
  });

  // Build redirect URL with code and state
  const redirectUrl = new URL(redirect_uri);
  redirectUrl.searchParams.set("code", code);
  if (state) {
    redirectUrl.searchParams.set("state", state);
  }

  res.redirect(redirectUrl.toString());
});

/**
 * POST /oauth/token
 *
 * Exchanges an authorization code for a JWT access token.
 * This is called by Swagger Editor after the redirect.
 */
router.post("/token", (req: Request, res: Response): void => {
  const { grant_type, code, redirect_uri, client_id } = req.body as Record<
    string,
    string | undefined
  >;

  if (grant_type !== "authorization_code") {
    res.status(400).json({ error: "unsupported_grant_type" });
    return;
  }

  if (!code) {
    res
      .status(400)
      .json({
        error: "invalid_request",
        error_description: "code is required",
      });
    return;
  }

  const stored = authCodes.get(code);

  if (!stored) {
    res
      .status(400)
      .json({
        error: "invalid_grant",
        error_description: "Invalid or expired authorization code",
      });
    return;
  }

  // Clean up used code
  authCodes.delete(code);

  // Check expiry
  if (Date.now() > stored.expiresAt) {
    res
      .status(400)
      .json({
        error: "invalid_grant",
        error_description: "Authorization code has expired",
      });
    return;
  }

  // Generate JWT access token
  const accessToken = jwt.sign(
    {
      sub: "oauth2-user",
      username: "demo-user",
      role: "user",
      scope: stored.scope,
      client_id: stored.clientId,
    },
    config.jwtSecret,
    { expiresIn: "1h" },
  );

  // Return token in OAuth2 format
  res.json({
    access_token: accessToken,
    token_type: "Bearer",
    expires_in: 3600,
    scope: stored.scope,
  });
});

export default router;

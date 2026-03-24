# Singpass / Myinfo v5 (FAPI 2.0) – Next.js Integration

This repo implements a production-ready Singpass/Myinfo v5 login flow using the same sequence as the official demo:

- PAR + PKCE (S256) + `state` + `nonce`
- `private_key_jwt` client authentication (no client secret)
- DPoP proof-of-possession for token + userinfo
- Optional encrypted responses (ID token / userinfo) when an encryption key is configured

## Routes

- `GET /login` → starts OIDC auth (PAR) and redirects to Singpass
- `GET /callback` → handles redirect, exchanges code for tokens, fetches userinfo, stores session, redirects to `/singpass`
- `GET /api/user` → returns logged-in user JSON or 401
- `POST /logout` (alias: `POST /api/logout`) → clears session
- `GET /.well-known/jwks.json` → serves public JWKS (sig + enc)

Frontend debug page:

- `/singpass` → shows logged-in status and displays requested fields + raw JSON

## Environment variables

Set these in `.env.local` (do not commit secrets):

```env
APP_BASE_URL=https://your-app.example.com
SESSION_SECRET=long-random-string

SINGPASS_ISSUER_URL=https://stg-id.singpass.gov.sg/fapi
SINGPASS_CLIENT_ID=...
SINGPASS_REDIRECT_URI=https://your-app.example.com/callback
SINGPASS_SCOPES=openid uinfin name aliasname birthcountry email mobileno nationality partialuinfin race sex

# Private JWK JSON (include kid + alg)
SINGPASS_JWKS_SIG_PRIVATE={"kty":"EC","crv":"P-256","x":"...","y":"...","d":"...","alg":"ES256","kid":"..."}

# Optional: for decrypting encrypted responses
SINGPASS_JWKS_ENC_PRIVATE={"kty":"EC","crv":"P-256","x":"...","y":"...","d":"...","alg":"ECDH-ES+A256KW","kid":"..."}
```

## Portal configuration (Singpass)

- **Redirect URI**: set to your HTTPS callback URL, e.g. `https://your-app.example.com/callback`
- **JWKS**: use either:
  - **Hosted**: point the portal at `/.well-known/jwks.json`, or
  - **Paste**: copy the output from `GET /.well-known/jwks.json` and paste the sig + enc public keys

### Getting the public JWKS

Start the app and open:

- `/.well-known/jwks.json`

This endpoint returns the **public** keys derived from your configured private keys (it strips `d`).

## Local development with HTTPS

Singpass requires HTTPS redirect URIs. Use a tunnel (e.g. Cloudflare Tunnel, ngrok) and set:

- `APP_BASE_URL=https://<tunnel-host>`
- `SINGPASS_REDIRECT_URI=https://<tunnel-host>/callback`

Then start Next.js normally.

## Security notes / hardening included

- **No secret logging**: authorization codes, access/refresh tokens, and private keys are never printed.
- **PKCE + state + nonce**: generated at `/login`, stored server-side, validated in `/callback`.
- **Session cookie**:
  - HttpOnly, SameSite=Lax, Secure in production
  - session rotation after successful login
  - short TTL + idle timeout (see `src/lib/security/session.ts`)
- **Rate limiting** (in-memory): `/login`, `/callback`, `/api/user` (basic IP window)
- **Callback validation**:
  - rejects missing session/auth context
  - handles IdP `error` params
- **CSRF**: logout enforces same-origin `Origin` when present (see `src/app/api/logout/route.ts`)
- **Hardening headers**: basic CSP + frame-ancestors deny + standard headers on auth endpoints

## Common errors

- **`invalid_request` / `redirect_uri mismatch`**: `SINGPASS_REDIRECT_URI` must exactly match portal settings and be HTTPS.
- **JWKS `kid` mismatch**: ensure your `kid` in the JWK matches what the portal expects, and that `/.well-known/jwks.json` serves the same `kid`.
- **DPoP issues**: DPoP proofs are generated with a 2-minute validity window (per Singpass expectation).

## Production notes

The in-memory rate limiter is fine for local/dev and single-instance deployments. For multi-instance/serverless, swap it for a shared store (Redis/Upstash) keyed by IP and session id.


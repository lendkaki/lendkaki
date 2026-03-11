import { NextRequest, NextResponse } from "next/server";
import * as openidClient from "openid-client";
import { getSingpassClient, getDpopOptions } from "@/lib/singpass/client";
import { getSingpassEnv } from "@/lib/singpass/env";
import { createRequestId } from "@/lib/security/requestId";
import { rateLimitOrThrow } from "@/lib/security/rateLimit";
import {
  newAnonymousSession,
  readSession,
  sealSession,
  SESSION_COOKIE_NAME,
  SESSION_TTL_SECONDS,
} from "@/lib/security/session";
import { redact } from "@/lib/security/redact";
import { withSecurityHeaders } from "@/lib/security/headers";

export async function GET(req: NextRequest) {
  const requestId = createRequestId();
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  try {
    rateLimitOrThrow({ key: `login:ip:${ip}`, limit: 20, windowMs: 60_000 });

    const env = getSingpassEnv();
    const { config, dpop } = await getSingpassClient();

    const currentUrl = new URL(req.url);
    const flow = currentUrl.searchParams.get("flow") ?? undefined;
    const loanAmountParam = currentUrl.searchParams.get("amount");
    const loanPurpose = currentUrl.searchParams.get("purpose") ?? undefined;
    const loanAmount =
      loanAmountParam != null && loanAmountParam !== "" ? Number(loanAmountParam) : undefined;

    const code_verifier = openidClient.randomPKCECodeVerifier();
    const code_challenge = await openidClient.calculatePKCECodeChallenge(code_verifier);
    const nonce = openidClient.randomNonce();
    const state = openidClient.randomState();

    const session = (await readSession()) ?? newAnonymousSession();
    session.auth = {
      code_verifier,
      nonce,
      state,
      createdAt: Date.now(),
      flow,
      loan_amount: Number.isFinite(loanAmount) ? loanAmount : undefined,
      loan_purpose: loanPurpose,
    };
    const sealedToken = await sealSession(session);

    console.log(
      `[LOGIN ${requestId}] Stored session.auth nonce=${redact(nonce)} state=${redact(state)} code_verifier_len=${code_verifier.length}`
    );

    const redirectTo = await openidClient.buildAuthorizationUrlWithPAR(
      config,
      {
        redirect_uri: env.SINGPASS_REDIRECT_URI,
        code_challenge_method: "S256",
        code_challenge,
        nonce,
        state,
        scope: env.SINGPASS_SCOPES,
      },
      getDpopOptions(dpop)
    );

    console.log(`[LOGIN ${requestId}] Redirecting to Singpass authorize endpoint (via PAR)`);

    const isProd = process.env.NODE_ENV === "production";
    const res = NextResponse.redirect(redirectTo.href, { status: 302 });
    res.cookies.set(SESSION_COOKIE_NAME, sealedToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: isProd,
      path: "/",
      maxAge: SESSION_TTL_SECONDS,
    });
    res.headers.set("x-request-id", requestId);
    return withSecurityHeaders(res);
  } catch (e: any) {
    if (e?.message === "rate_limited") {
      const retry = String(e.retryAfterSec ?? 60);
      const res = NextResponse.json({ error: "Too Many Requests" }, { status: 429 });
      res.headers.set("Retry-After", retry);
      res.headers.set("x-request-id", requestId);
      return withSecurityHeaders(res);
    }
    console.error(`[LOGIN ${requestId}] ERROR`, e);
    const res = NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    res.headers.set("x-request-id", requestId);
    return withSecurityHeaders(res);
  }
}


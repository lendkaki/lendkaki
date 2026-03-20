import { NextRequest, NextResponse } from "next/server";
import * as openidClient from "openid-client";
import { getSingpassClient, getDpopOptions } from "@/lib/singpass/client";
import { createRequestId } from "@/lib/security/requestId";
import { rateLimitOrThrow } from "@/lib/security/rateLimit";
import {
  readSession,
  rotateSession,
  sealSession,
  SESSION_COOKIE_NAME,
  SESSION_TTL_SECONDS,
} from "@/lib/security/session";
import { redact, summarizeObjectKeys, tryDecodeJwt } from "@/lib/security/redact";
import { withSecurityHeaders } from "@/lib/security/headers";
import { supabase } from "@/lib/supabase";
import { parseMyinfoPayload } from "@/lib/myinfo/parser";

export async function GET(req: NextRequest) {
  const requestId = createRequestId();
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  try {
    rateLimitOrThrow({ key: `callback:ip:${ip}`, limit: 30, windowMs: 60_000 });

    const session = await readSession();
    if (!session?.auth?.code_verifier || !session?.auth?.nonce || !session?.auth?.state) {
      console.error(`[CALLBACK ${requestId}] Missing session.auth (did you start at /login?)`);
      const res = NextResponse.redirect(
        new URL("/apply-error?reason=session_expired", req.url),
        { status: 302 }
      );
      res.headers.set("x-request-id", requestId);
      return withSecurityHeaders(res);
    }
    const { code_verifier, nonce, state } = session.auth;

    const currentUrl = new URL(req.url);
    const qpKeys = Array.from(currentUrl.searchParams.keys()).sort();
    console.log(`[CALLBACK ${requestId}] Incoming query param keys=${qpKeys.join(",")}`);

    if (currentUrl.searchParams.get("error")) {
      const err = currentUrl.searchParams.get("error");
      const desc = currentUrl.searchParams.get("error_description");
      console.error(`[CALLBACK ${requestId}] IdP error=${err} desc=${desc ?? "[none]"}`);
      const reason = err === "access_denied" ? "cancelled" : "login_failed";
      const res = NextResponse.redirect(
        new URL(`/apply-error?reason=${reason}`, req.url),
        { status: 302 }
      );
      res.headers.set("x-request-id", requestId);
      return withSecurityHeaders(res);
    }

    console.log(`[CALLBACK ${requestId}] Loaded session.auth state=${redact(state)} nonce=${redact(nonce)}`);

    const { config, dpop } = await getSingpassClient();

    const tokens = await openidClient.authorizationCodeGrant(
      config,
      currentUrl,
      {
        pkceCodeVerifier: code_verifier,
        expectedNonce: nonce,
        expectedState: state,
        idTokenExpected: true,
      },
      undefined,
      getDpopOptions(dpop)
    );

    // Never log raw tokens
    console.log(
      `[CALLBACK ${requestId}] Token response received (access_token:${redact(tokens.access_token)} refresh_token:${redact(tokens.refresh_token)} token_type:${tokens.token_type ?? "[none]"})`
    );

    const decodedId = tryDecodeJwt(tokens.id_token);
    if (decodedId) {
      console.log(`[CALLBACK ${requestId}] Decoded id_token header:`);
      console.log(decodedId.header);
      console.log(`[CALLBACK ${requestId}] Decoded id_token payload:`);
      console.log(decodedId.payload);
    }

    const decodedAccess = tryDecodeJwt(tokens.access_token);
    if (decodedAccess) {
      console.log(`[CALLBACK ${requestId}] Decoded access_token header:`);
      console.log(decodedAccess.header);
      console.log(`[CALLBACK ${requestId}] Decoded access_token payload:`);
      console.log(decodedAccess.payload);
    }

    const idTokenClaims = tokens.claims();
    console.log(`[CALLBACK ${requestId}] ID token claims keys=${summarizeObjectKeys(idTokenClaims).join(",")}`);
    if (!idTokenClaims?.sub) {
      throw new Error("Missing sub in ID token claims");
    }

    console.log(`[CALLBACK ${requestId}] Fetching userinfo`);
    const userInfo = await openidClient.fetchUserInfo(
      config,
      tokens.access_token,
      idTokenClaims.sub,
      getDpopOptions(dpop)
    );
    console.log(
      `[CALLBACK ${requestId}] Userinfo received keys=${summarizeObjectKeys(userInfo).join(",")}`
    );

    // Persist parsed Myinfo data into customer_profiles (raw included)
    try {
      const loan_amount = session.auth?.loan_amount ?? null;
      const loan_purpose = session.auth?.loan_purpose ?? null;

      const rawPayload = {
        id_token: idTokenClaims,
        userinfo: userInfo,
      } as Record<string, unknown>;

      const profileData = parseMyinfoPayload(
        String(idTokenClaims.sub),
        rawPayload,
        {
          loanAmount: loan_amount,
          loanPurpose: loan_purpose,
        }
      );

      const { data: profileRow, error: profileError } = await supabase
        .from("customer_profiles")
        .insert(profileData as any)
        .select("id")
        .single();

      if (profileError) {
        console.error(`[CALLBACK ${requestId}] Failed to insert customer_profiles`, profileError);
      } else {
        console.log(`[CALLBACK ${requestId}] Stored customer_profiles row id=${profileRow?.id}`);
      }
    } catch (saveError) {
      console.error(`[CALLBACK ${requestId}] Exception while saving customer_profiles`, saveError);
    }

    // Extract only essential fields for the session cookie to stay under 4KB.
    const person = (userInfo as any)?.person_info ?? userInfo;
    const slimUser: Record<string, unknown> = {
      sub: String(idTokenClaims.sub),
      name: (person?.name as any)?.value ?? null,
      email: (person?.email as any)?.value ?? (person?.emailaddress as any)?.value ?? null,
      phone: (person?.mobileno as any)?.nbr?.value ?? (person?.mobileno as any)?.value ?? null,
      nationality: (person?.nationality as any)?.desc ?? (person?.nationality as any)?.value ?? null,
    };

    const nextSession = rotateSession({
      ...session,
      auth: undefined,
      user: slimUser,
    });
    const sealedToken = await sealSession(nextSession);

    const flow = session.auth?.flow;
    let redirectPath = "/singpass";
    if (flow === "apply" || flow === "apply-now-express") {
      redirectPath = "/apply-review";
    }

    const isProd = process.env.NODE_ENV === "production";
    const res = NextResponse.redirect(new URL(redirectPath, req.url), { status: 302 });
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
    console.error(`[CALLBACK ${requestId}] ERROR`, e);
    const res = NextResponse.redirect(
      new URL("/apply-error?reason=server_error", req.url),
      { status: 302 }
    );
    res.headers.set("x-request-id", requestId);
    return withSecurityHeaders(res);
  }
}


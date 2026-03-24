import { NextRequest, NextResponse } from "next/server";
import { createRequestId } from "@/lib/security/requestId";
import { rateLimitOrThrow } from "@/lib/security/rateLimit";
import { readSession, touchSession, writeSession } from "@/lib/security/session";
import { withSecurityHeaders } from "@/lib/security/headers";
import { supabase } from "@/lib/supabase";

const EDITABLE_FIELDS = new Set(["email", "mobileno", "marital_status"]);

export async function GET(req: NextRequest) {
  const requestId = createRequestId();
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  try {
    rateLimitOrThrow({ key: `user:ip:${ip}`, limit: 120, windowMs: 60_000 });

    const session = await readSession();
    if (!session?.user) {
      const res = NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      res.headers.set("x-request-id", requestId);
      return withSecurityHeaders(res);
    }

    await writeSession(touchSession(session));

    const sub = session.user.sub as string | undefined;
    let fullPayload: Record<string, unknown> = { ...session.user };

    if (sub) {
      const { data: profile } = await supabase
        .from("customer_profiles")
        .select("*")
        .eq("sub", sub)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (profile) {
        fullPayload = {
          ...session.user,
          profile,
        };
      }
    }

    const res = NextResponse.json(fullPayload, { status: 200 });
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
    console.error(`[USER ${requestId}] ERROR`, e);
    const res = NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    res.headers.set("x-request-id", requestId);
    return withSecurityHeaders(res);
  }
}

export async function PATCH(req: NextRequest) {
  const requestId = createRequestId();
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  try {
    rateLimitOrThrow({ key: `user-patch:ip:${ip}`, limit: 30, windowMs: 60_000 });

    const session = await readSession();
    if (!session?.user) {
      const res = NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      res.headers.set("x-request-id", requestId);
      return withSecurityHeaders(res);
    }

    const body = await req.json();
    const profileId = body.profile_id;
    if (!profileId || typeof profileId !== "string") {
      const res = NextResponse.json({ error: "Missing profile_id" }, { status: 400 });
      res.headers.set("x-request-id", requestId);
      return withSecurityHeaders(res);
    }

    const updates: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(body)) {
      if (EDITABLE_FIELDS.has(key)) {
        updates[key] = value;
      }
    }

    if (Object.keys(updates).length === 0) {
      const res = NextResponse.json({ error: "No editable fields provided" }, { status: 400 });
      res.headers.set("x-request-id", requestId);
      return withSecurityHeaders(res);
    }

    updates.updated_at = new Date().toISOString();

    const { error } = await supabase
      .from("customer_profiles")
      .update(updates)
      .eq("id", profileId);

    if (error) {
      console.error(`[USER-PATCH ${requestId}] Update failed`, error);
      const res = NextResponse.json({ error: "Update failed" }, { status: 500 });
      res.headers.set("x-request-id", requestId);
      return withSecurityHeaders(res);
    }

    const res = NextResponse.json({ ok: true }, { status: 200 });
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
    console.error(`[USER-PATCH ${requestId}] ERROR`, e);
    const res = NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    res.headers.set("x-request-id", requestId);
    return withSecurityHeaders(res);
  }
}


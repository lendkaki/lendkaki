import { NextRequest, NextResponse } from "next/server";
import { createRequestId } from "@/lib/security/requestId";
import { rateLimitOrThrow } from "@/lib/security/rateLimit";
import { readSession, touchSession, writeSession } from "@/lib/security/session";
import { withSecurityHeaders } from "@/lib/security/headers";
import { supabase } from "@/lib/supabase";

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

    // Enrich with full Myinfo from Supabase if available
    if (sub) {
      const { data } = await supabase
        .from("myinfo_profiles" as const)
        .select("raw, loan_amount, loan_purpose")
        .eq("sub", sub)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (data) {
        const raw = (data.raw ?? {}) as Record<string, unknown>;
        const userinfo = (raw.userinfo ?? raw) as Record<string, unknown>;
        fullPayload = {
          ...session.user,
          person_info: (userinfo as any).person_info ?? null,
          loan_amount: data.loan_amount ?? null,
          loan_purpose: data.loan_purpose ?? null,
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


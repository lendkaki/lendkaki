import { NextRequest, NextResponse } from "next/server";
import { createRequestId } from "@/lib/security/requestId";
import { clearSession } from "@/lib/security/session";
import { withSecurityHeaders } from "@/lib/security/headers";
import { getSingpassEnv } from "@/lib/singpass/env";

export async function POST(req: NextRequest) {
  const requestId = createRequestId();
  try {
    // Basic CSRF protection: enforce same-origin requests
    const env = getSingpassEnv();
    const origin = req.headers.get("origin");
    if (origin && origin !== env.APP_BASE_URL) {
      const res = NextResponse.json({ error: "Forbidden" }, { status: 403 });
      res.headers.set("x-request-id", requestId);
      return withSecurityHeaders(res);
    }

    await clearSession();
    const res = NextResponse.json({ success: true }, { status: 200 });
    res.headers.set("x-request-id", requestId);
    return withSecurityHeaders(res);
  } catch (e) {
    console.error(`[LOGOUT ${requestId}] ERROR`, e);
    const res = NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    res.headers.set("x-request-id", requestId);
    return withSecurityHeaders(res);
  }
}


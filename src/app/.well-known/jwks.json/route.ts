import { NextResponse } from "next/server";
import { getSingpassEnv } from "@/lib/singpass/env";
import { ensureUse, toPublicJwk } from "@/lib/singpass/keys";
import { createRequestId } from "@/lib/security/requestId";
import { withSecurityHeaders } from "@/lib/security/headers";

export async function GET() {
  const requestId = createRequestId();
  const env = getSingpassEnv();

  const sigPrivate = env.SINGPASS_JWKS_SIG_PRIVATE as any;
  const encPrivate = env.SINGPASS_JWKS_ENC_PRIVATE as any | undefined;

  const keys: any[] = [];
  keys.push(ensureUse(toPublicJwk(sigPrivate), "sig"));
  if (encPrivate) keys.push(ensureUse(toPublicJwk(encPrivate), "enc"));

  const res = NextResponse.json({ keys }, { status: 200 });
  res.headers.set("x-request-id", requestId);
  return withSecurityHeaders(res);
}


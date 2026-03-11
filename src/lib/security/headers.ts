import { NextResponse } from "next/server";

export function withSecurityHeaders(res: NextResponse) {
  // Minimal hardening; adjust CSP as you add inline scripts etc.
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("Referrer-Policy", "no-referrer");
  res.headers.set("Permissions-Policy", "geolocation=(), microphone=(), camera=()");
  res.headers.set("Cross-Origin-Opener-Policy", "same-origin");
  res.headers.set("Cross-Origin-Resource-Policy", "same-origin");
  res.headers.set("X-Frame-Options", "DENY");
  // CSP: allow self only. If you embed external scripts, expand carefully.
  res.headers.set("Content-Security-Policy", "default-src 'self'; frame-ancestors 'none'");
  return res;
}


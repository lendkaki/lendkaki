import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const currentUrl = new URL(request.url);
  const target = new URL("/api/auth/login", request.url);
  target.search = currentUrl.search; // preserve ?flow=..., amount, purpose, etc.

  return NextResponse.redirect(target, {
    status: 302,
  });
}


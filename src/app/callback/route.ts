import { NextResponse } from "next/server";

export async function GET(request: Request) {
  return NextResponse.redirect(new URL("/api/auth/callback", request.url), {
    status: 302,
  });
}


import { NextResponse } from "next/server";

export async function POST(request: Request) {
  return NextResponse.redirect(new URL("/api/logout", request.url), {
    status: 307,
  });
}


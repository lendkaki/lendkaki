import { EncryptJWT, jwtDecrypt } from "jose";
import crypto from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "lk_session";
const TTL_SECONDS = 15 * 60; // 15 minutes absolute TTL
const IDLE_SECONDS = 10 * 60; // 10 minutes idle timeout

export type SessionAuth = {
  code_verifier: string;
  nonce: string;
  state: string;
  createdAt: number;
  flow?: string;
  loan_amount?: number;
  loan_purpose?: string;
};

export type SessionData = {
  sid: string;
  iat: number;
  exp: number;
  lastSeenAt: number;
  auth?: SessionAuth;
  user?: Record<string, unknown>;
};

function getKey(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("Missing SESSION_SECRET");
  return crypto.createHash("sha256").update(secret).digest();
}

function nowSec() {
  return Math.floor(Date.now() / 1000);
}

function newSid() {
  return crypto.randomBytes(18).toString("hex");
}

export async function readSession(): Promise<SessionData | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtDecrypt(token, getKey(), {
      clockTolerance: "5s",
    });
    const session = payload as unknown as SessionData;
    const now = nowSec();
    if (!session?.sid || !session?.exp || session.exp < now) return null;
    if (session.lastSeenAt && now - session.lastSeenAt > IDLE_SECONDS)
      return null;
    return session;
  } catch {
    return null;
  }
}

export async function writeSession(session: SessionData) {
  const cookieStore = await cookies();
  const isProd = process.env.NODE_ENV === "production";
  cookieStore.set(COOKIE_NAME, await sealSession(session), {
    httpOnly: true,
    sameSite: "lax",
    secure: isProd,
    path: "/",
    maxAge: TTL_SECONDS,
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export function newAnonymousSession(): SessionData {
  const iat = nowSec();
  const exp = iat + TTL_SECONDS;
  return { sid: newSid(), iat, exp, lastSeenAt: iat };
}

export function rotateSession(session: SessionData): SessionData {
  const iat = nowSec();
  const exp = iat + TTL_SECONDS;
  return {
    ...session,
    sid: newSid(),
    iat,
    exp,
    lastSeenAt: iat,
  };
}

export function touchSession(session: SessionData): SessionData {
  return { ...session, lastSeenAt: nowSec() };
}

export async function sealSession(session: SessionData) {
  const iat = nowSec();
  const exp = session.exp ?? iat + TTL_SECONDS;
  return await new EncryptJWT(session as any)
    .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
    .setIssuedAt(iat)
    .setExpirationTime(exp)
    .encrypt(getKey());
}

export const SESSION_COOKIE_NAME = COOKIE_NAME;
export const SESSION_TTL_SECONDS = TTL_SECONDS;

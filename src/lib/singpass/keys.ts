import type { JWK } from "jose";

type JwkLike = JWK & { kid?: string; alg?: string; use?: string };

export function toPublicJwk(jwk: JwkLike): JwkLike {
  const { d: _d, ...rest } = jwk as any;
  return rest;
}

export function ensureUse(jwk: JwkLike, use: "sig" | "enc"): JwkLike {
  return { ...jwk, use };
}


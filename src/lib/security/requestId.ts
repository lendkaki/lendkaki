import crypto from "node:crypto";

export function createRequestId(): string {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
  return crypto.randomBytes(12).toString("hex");
}


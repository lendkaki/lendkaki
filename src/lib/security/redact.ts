export function redact(value: unknown) {
  if (typeof value !== "string") return value;
  if (value.length <= 12) return "[redacted]";
  return `${value.slice(0, 4)}…${value.slice(-4)}`;
}

export function summarizeObjectKeys(value: unknown) {
  if (value && typeof value === "object")
    return Object.keys(value as Record<string, unknown>).sort();
  return [];
}

function base64UrlDecodeToString(input: string) {
  const padLen = (4 - (input.length % 4)) % 4;
  const padded = (input + "=".repeat(padLen))
    .replace(/-/g, "+")
    .replace(/_/g, "/");
  return Buffer.from(padded, "base64").toString("utf8");
}

export function tryDecodeJwt(
  token: unknown
): { header: unknown; payload: unknown } | null {
  if (typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  try {
    const headerJson = base64UrlDecodeToString(parts[0]);
    const payloadJson = base64UrlDecodeToString(parts[1]);
    return { header: JSON.parse(headerJson), payload: JSON.parse(payloadJson) };
  } catch {
    return null;
  }
}


type Bucket = { resetAt: number; count: number };

const buckets = new Map<string, Bucket>();

export function rateLimitOrThrow(opts: {
  key: string;
  limit: number;
  windowMs: number;
}) {
  const now = Date.now();
  const existing = buckets.get(opts.key);
  if (!existing || existing.resetAt <= now) {
    buckets.set(opts.key, { resetAt: now + opts.windowMs, count: 1 });
    return;
  }
  existing.count += 1;
  if (existing.count > opts.limit) {
    const retryAfterSec = Math.max(1, Math.ceil((existing.resetAt - now) / 1000));
    const err = new Error("rate_limited");
    (err as any).retryAfterSec = retryAfterSec;
    throw err;
  }
}


create table if not exists public.myinfo_profiles (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  -- Which flow triggered this login (e.g. apply-now-express)
  flow text,

  -- Stable identifiers from Myinfo / Singpass
  sub text,
  uinfin text,

  -- Optional loan context captured at login time
  loan_amount numeric,
  loan_purpose text,

  -- Raw merged payload for debugging (ID token claims + userinfo)
  raw jsonb not null
);


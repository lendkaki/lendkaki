create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  -- core fields from full form
  loan_amount numeric,
  loan_purpose text,
  tenure integer,
  full_name text,
  email text,
  phone text,
  nationality text,
  employment_status text,
  monthly_income numeric,
  company text,

  -- tracking / marketing fields
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  landing_page text,
  variant text
);


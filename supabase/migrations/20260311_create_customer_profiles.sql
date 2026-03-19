create table if not exists public.customer_profiles (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Singpass subject identifier
  sub text not null,

  -- Identity
  uinfin text,
  name text,
  aliasname text,
  hanyupinyinname text,
  hanyupinyinaliasname text,
  marriedname text,

  -- Demographics (codes — resolve via src/lib/myinfo/codes.ts)
  sex text,
  race text,
  dob date,
  nationality text,
  birthcountry text,
  residential_status text,
  marital_status text,

  -- Contact
  email text,
  mobileno text,

  -- Address (complex structure stored as JSONB)
  regadd jsonb,

  -- Housing (mutually exclusive: housingtype for private, hdbtype for HDB)
  housingtype text,
  hdbtype text,
  hdbownership jsonb,

  -- Employment
  employment text,
  employmentsector text,
  occupation text,

  -- Foreigners only
  passtype text,
  passstatus text,
  passexpirydate date,

  -- Financial
  noa_basic jsonb,
  cpf_contributions jsonb,
  cpf_housing_withdrawal jsonb,

  -- Assets
  vehicles jsonb,
  ownerprivate boolean,

  -- Loan context (copied from session at login time)
  loan_amount numeric,
  loan_purpose text,

  -- Full raw Myinfo response for audit / restore
  raw jsonb
);

create index idx_customer_profiles_sub on public.customer_profiles (sub);
create index idx_customer_profiles_uinfin on public.customer_profiles (uinfin);

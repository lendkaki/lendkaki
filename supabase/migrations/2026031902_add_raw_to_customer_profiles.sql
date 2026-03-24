-- Store the raw Myinfo response in customer_profiles so everything is in one place
alter table public.customer_profiles
  add column if not exists raw jsonb;

-- Remove the myinfo_profiles FK from customer_profiles (no longer needed)
alter table public.customer_profiles
  drop column if exists myinfo_profile_id;

-- Add optional link from leads → customer_profiles
-- Nullable so manual leads (no Singpass) still work fine
alter table public.leads
  add column if not exists customer_profile_id uuid
    references public.customer_profiles(id);

create index if not exists idx_leads_customer_profile_id
  on public.leads (customer_profile_id);

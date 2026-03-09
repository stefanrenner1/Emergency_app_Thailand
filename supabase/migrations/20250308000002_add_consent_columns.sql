-- Add consent columns to profiles (PDPA compliance)
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS privacy_policy_accepted_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS disclaimer_accepted_at TIMESTAMPTZ;

-- Soft delete: Profile wird als gelöscht markiert, Daten bleiben in DB
-- User kann sich mit gleichen Zugangsdaten wieder einloggen und neues Profil anlegen
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

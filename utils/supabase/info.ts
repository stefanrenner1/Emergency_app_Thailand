/**
 * Supabase-Konfiguration
 * Projekt-URL: https://jbtamfvpbjzmlqdpxvrh.supabase.co
 *
 * Den Anon Key findest du im Supabase Dashboard unter:
 * Project Settings → API → Project API keys → anon public
 */

export const projectId = "jbtamfvpbjzmlqdpxvrh";

const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
if (!anonKey) {
  console.warn(
    "VITE_SUPABASE_ANON_KEY fehlt in .env – Supabase-API-Aufrufe werden fehlschlagen. " +
      "Den Key findest du im Supabase Dashboard unter Project Settings → API → anon public."
  );
}
export const publicAnonKey = anonKey ?? "";

import { supabase } from "./client";

export interface RemoteUserProfile {
  user_id: string;
  fullName: string;
  insuranceNumber: string;
  nationality?: string;
  dateOfBirth?: string;
  contactName: string;
  contactPhone: string;
  medicalNotes?: string;
  privacyPolicyAcceptedAt?: string;
  disclaimerAcceptedAt?: string;
}

// Snake_case for Supabase
interface ProfileRow {
  user_id: string;
  full_name: string;
  insurance_number: string;
  nationality?: string | null;
  date_of_birth?: string | null;
  contact_name: string;
  contact_phone: string;
  medical_notes?: string | null;
  privacy_policy_accepted_at?: string | null;
  disclaimer_accepted_at?: string | null;
}

function fromRow(row: ProfileRow): RemoteUserProfile {
  return {
    user_id: row.user_id,
    fullName: row.full_name ?? "",
    insuranceNumber: row.insurance_number ?? "",
    nationality: row.nationality ?? undefined,
    dateOfBirth: row.date_of_birth ?? undefined,
    contactName: row.contact_name ?? "",
    contactPhone: row.contact_phone ?? "",
    medicalNotes: row.medical_notes ?? undefined,
    privacyPolicyAcceptedAt: row.privacy_policy_accepted_at ?? undefined,
    disclaimerAcceptedAt: row.disclaimer_accepted_at ?? undefined,
  };
}

export async function saveUserProfile(
  userId: string,
  profile: Omit<RemoteUserProfile, "user_id">,
): Promise<void> {
  let consentFields: Record<string, string | null> = {};
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("emergency_app_registration_consent");
      if (stored) {
        const parsed = JSON.parse(stored);
        consentFields = {
          privacy_policy_accepted_at: parsed.privacyPolicyAcceptedAt || null,
          disclaimer_accepted_at: parsed.disclaimerAcceptedAt || null,
        };
        localStorage.removeItem("emergency_app_registration_consent");
      }
    } catch {
      // ignore
    }
  }

  const { error } = await supabase.from("profiles").upsert(
    {
      user_id: userId,
      full_name: profile.fullName,
      insurance_number: profile.insuranceNumber,
      nationality: profile.nationality || null,
      date_of_birth: profile.dateOfBirth || null,
      contact_name: profile.contactName,
      contact_phone: profile.contactPhone,
      medical_notes: profile.medicalNotes || null,
      deleted_at: null, // Profil wiederherstellen falls vorher soft-deleted
      ...consentFields,
    },
    { onConflict: "user_id" }
  );

  if (error) {
    console.error("Failed to save profile to Supabase:", error);
    throw new Error(error.message);
  }
}

export async function loadUserProfile(userId: string): Promise<RemoteUserProfile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("user_id,full_name,insurance_number,nationality,date_of_birth,contact_name,contact_phone,medical_notes,privacy_policy_accepted_at,disclaimer_accepted_at")
    .eq("user_id", userId)
    .is("deleted_at", null)
    .maybeSingle();

  if (error) {
    console.error("Failed to load profile from Supabase:", error);
    throw new Error(error.message);
  }

  return data ? fromRow(data as ProfileRow) : null;
}

/**
 * Soft delete: Markiert Profil als gelöscht (deleted_at), Daten bleiben in DB.
 * User kann sich mit gleichen Zugangsdaten wieder einloggen und neues Profil anlegen.
 */
export async function deleteUserProfile(userId: string): Promise<void> {
  const { error } = await supabase
    .from("profiles")
    .update({ deleted_at: new Date().toISOString() })
    .eq("user_id", userId);

  if (error) {
    console.error("Failed to soft delete profile in Supabase:", error);
    throw new Error(error.message);
  }
}

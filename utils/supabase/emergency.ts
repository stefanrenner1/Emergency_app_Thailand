import { supabase } from "./client";

export interface EmergencyLocation {
  street?: string;
  district?: string;
  province?: string;
  latitude?: number;
  longitude?: number;
  coordinates?: string;
}

export async function saveEmergency(params: {
  userId?: string | null;
  type: "emergency" | "no_emergency";
  situation?: string;
  answers?: Record<string, string>;
  location?: EmergencyLocation;
  selectedNumber?: string;
}): Promise<void> {
  const { error } = await supabase.from("emergencies").insert({
    user_id: params.userId || null,
    type: params.type,
    situation: params.situation || null,
    answers: params.answers || null,
    location: params.location || null,
    selected_number: params.selectedNumber || null,
  });

  if (error) {
    console.error("Failed to save emergency:", error);
    throw new Error(error.message);
  }
}

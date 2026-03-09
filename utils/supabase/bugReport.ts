import { supabase } from "./client";

export async function submitBugReport(message: string, userId?: string | null): Promise<void> {
  const { error } = await supabase.from("bug_reports").insert({
    user_id: userId || null,
    message: message.trim(),
  });

  if (error) {
    console.error("Failed to submit bug report:", error);
    throw new Error(error.message);
  }
}

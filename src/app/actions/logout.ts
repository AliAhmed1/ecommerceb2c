"use server";
import { createClient } from "@/utilities/supabase/server";

export const logout = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
};


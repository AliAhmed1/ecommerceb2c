"use server";
import { redirect } from "next/navigation";
import { createClient } from "@/utilities/supabase/server";
import type { User } from "@/reducers/user/user.type";

export const login = async (user: User) => {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: user.password,
  });

  if (error) return error.message;
  redirect("/shop");
};


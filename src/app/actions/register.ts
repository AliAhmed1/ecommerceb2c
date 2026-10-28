"use server";
import { redirect } from "next/navigation";
import { createClient } from "@/utilities/supabase/server";
import type { User } from "@/reducers/user/user.type";

export const register = async (user: Required<User>) => {
  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email: user.email,
    password: user.password,
    options: {
      data: {
        full_name: user.fullName,
      },
    },
  });

  if (error) return error.message;
  redirect("/login");
};

"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServer } from "@/utils/supabase/server";
import { getLocale } from "next-intl/server";
import { redirect } from "@/i18n/routing";

export async function login(email: string, password: string) {
  const supabase = await createSupabaseServer();
  const locale = await getLocale();

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return error;
  }

  revalidatePath("/", "layout");
  redirect({ href: "/picker", locale });
}

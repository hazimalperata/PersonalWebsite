import { TypedSupabaseClient } from "@/types/supabase";

export function setAccountTaken(
  client: TypedSupabaseClient,
  account_id: string,
  user_id: string,
) {
  return client
    .from("accounts")
    .update({ taken_user_id: user_id })
    .eq("account_id", account_id);
}

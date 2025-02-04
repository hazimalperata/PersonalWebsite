import { TypedSupabaseClient } from "@/types/supabase";
import { SortingState } from "@tanstack/react-table";
import { Region } from "@/app/[locale]/picker/region-filter";

export function getAccounts(
  client: TypedSupabaseClient,
  page: number,
  pageSize: number,
  sortingState: SortingState,
  userId?: string,
  region?: Region,
) {
  const start = (page - 1) * pageSize;
  const end = start + pageSize - 1;

  let query = client
    .from("accounts")
    .select(
      `
        *,
        users:taken_user_id ( username )
      `,
      { count: "exact" },
    )
    .range(start, end);

  query = query.order("taken_user_id", { ascending: true });

  query = query.eq("region_name", region?.value as string);

  if (userId) {
    query = query.or(`taken_user_id.eq.${userId},taken_user_id.is.null`);
  }

  if (sortingState && sortingState.length) {
    sortingState.forEach((sort) => {
      query = query.order(sort.id, { ascending: !sort.desc });
    });
  }

  return query;
}

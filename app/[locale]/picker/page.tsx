import { createSupabaseServer } from "@/utils/supabase/server";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { prefetchQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { getAccounts } from "@/queries/get-accounts";
import AccountsArea from "@/app/[locale]/picker/accounts-area";
import {
  DEFAULT_TABLE_PAGE,
  DEFAULT_TABLE_PAGE_SIZE,
} from "@/constants/dataTable";

export default async function Picker() {
  const queryClient = new QueryClient();
  const supabase = await createSupabaseServer();

  const user = await supabase.auth.getUser();
  const userId = user.data.user?.id;

  await prefetchQuery(
    queryClient,
    getAccounts(
      supabase,
      DEFAULT_TABLE_PAGE,
      DEFAULT_TABLE_PAGE_SIZE,
      [],
      userId,
    ),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AccountsArea />
    </HydrationBoundary>
  );
}

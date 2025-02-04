import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TypedSupabaseClient } from "@/types/supabase";
import { useCallback, useEffect, useState, useTransition } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Tables } from "@/database.types";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { redirect } from "@/i18n/routing";
import { useLocale } from "next-intl";

export default function AvatarHeader(props: { supabase: TypedSupabaseClient }) {
  const { supabase } = props;
  const [user, setUser] = useState<Tables<"users">>();
  const locale = useLocale();

  useEffect(() => {
    (async () => {
      const currentUser = await supabase.auth.getUser();
      const user = await supabase
        .from("users")
        .select("*")
        .eq("id", currentUser.data.user?.id as string)
        .limit(1);

      if (user.data) {
        setUser(user.data[0]);
      }
    })();
  }, [supabase]);

  const [isPending, startTransition] = useTransition();

  const handleLogout = useCallback(() => {
    startTransition(async () => {
      await supabase.auth.signOut();
      redirect({ href: "/login", locale });
    });
  }, [locale, supabase.auth]);

  return (
    <div className="flex flex-row items-center justify-between">
      <div className="flex flex-row items-center gap-x-2">
        {user ? (
          <>
            <Avatar>
              <AvatarImage
                src={user.profile_image_url as string}
                alt={user.username}
              />
              <AvatarFallback>{user.username.at(0)}</AvatarFallback>
            </Avatar>
            <Label className="text-lg">{user.username}</Label>
          </>
        ) : (
          <>
            <Skeleton className="rounded-full h-10 w-10" />
            <Skeleton className="rounded-full h-7 w-20" />
          </>
        )}
      </div>
      <Button
        variant="destructive"
        isLoading={isPending}
        onClick={handleLogout}
      >
        Çıkış Yap
      </Button>
    </div>
  );
}

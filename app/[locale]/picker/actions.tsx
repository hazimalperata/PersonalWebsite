"use client";

import { Button } from "@/components/ui/button";
import { ShieldBan, UserCheck } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tables } from "@/database.types";
import { TypedSupabaseClient } from "@/types/supabase";
import { useToast } from "@/hooks/use-toast";
import {
  useDeleteMutation,
  useUpdateMutation,
} from "@supabase-cache-helpers/postgrest-react-query";
import { useCallback, useState } from "react";
import { useQuery } from "@tanstack/react-query";

type UserActionsProps = {
  account: Tables<"accounts">;
  supabase: TypedSupabaseClient;
};

export default function UserActions(props: UserActionsProps) {
  const { account, supabase } = props;

  const { toast } = useToast();

  const { data, isSuccess } = useQuery({
    queryKey: ["user"],
    queryFn: async () => await supabase.auth.getUser(),
  });

  const { mutateAsync: deleteAccount, isPending: isDeleting } =
    useDeleteMutation(supabase.from("accounts"), ["account_id"], null, {
      revalidateTables: [{ table: "accounts" }],
      onSuccess: () => {
        toast({
          title: "Hesap başarıyla silindi",
          description: "Hesabı banlı olduğu için sildiniz.",
        });
      },
      onError: () => {
        toast({
          title: "Bir sorun oluştu!",
          description:
            "Bilinmeyen bir sorun oluştu. Daha sonra tekrar deneyiniz.",
          variant: "destructive",
        });
      },
    });

  const { mutateAsync: setTakenAccount, isPending: isTaking } =
    useUpdateMutation(supabase.from("accounts"), ["account_id"], null, {
      // revalidateTables: [{ table: "accounts" }],
      onSuccess: async () => {
        toast({
          title: "Hesap başarıyla alındı",
          description: "Hesap bilgileri otomatik olarak kopyalandı.",
        });
        await navigator.clipboard.writeText(
          [account.username, account.password].join(":"),
        );
      },
      onError: () => {
        toast({
          title: "Bir sorun oluştu!",
          description:
            "Bilinmeyen bir sorun oluştu. Daha sonra tekrar deneyiniz.",
          variant: "destructive",
        });
      },
    });

  const handleDelete = async () => {
    await deleteAccount({ account_id: account.account_id });
  };

  const handleTake = async () => {
    if (data && data.data.user) {
      await setTakenAccount({
        account_id: account.account_id,
        taken_user_id: data.data.user.id,
      });
    }
  };

  return (
    <div className="flex flex-row items-center gap-x-1">
      {isSuccess && account.taken_user_id !== data?.data.user?.id && (
        <>
          <Button variant="default" isLoading={isTaking} onClick={handleTake}>
            <UserCheck />
            AL
          </Button>
          <Separator orientation="vertical" className="h-4" />
        </>
      )}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" size="icon">
            <ShieldBan />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Emin misin?</AlertDialogTitle>
            <AlertDialogDescription>
              Hesabın banlı olduğunu onaylayıp hesabı kalıcı olarak silmek
              üzeresin. Bu işlem geri alınamaz bir işlemdir.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Vazgeç</AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button isLoading={isDeleting} onClick={handleDelete}>
                Sil
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

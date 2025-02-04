"use client";

import { DataTable } from "@/app/[locale]/picker/data-table";
import useSupabaseBrowser from "@/utils/supabase/client";
import { ColumnDef } from "@tanstack/react-table";
import { Tables } from "@/database.types";
import UserActions from "@/app/[locale]/picker/actions";
import AvatarHeader from "@/app/[locale]/picker/avatar-header";

export default function AccountsArea() {
  const supabase = useSupabaseBrowser();

  const columns: ColumnDef<
    Tables<"accounts"> & { users?: { username: string } }
  >[] = [
    {
      accessorKey: "account_id",
      header: "HESAP ID",
    },
    {
      accessorKey: "username",
      header: "Kullanıcı Adı",
    },
    {
      accessorKey: "password",
      header: "Şifre",
    },
    {
      accessorKey: "level",
      header: "Level",
    },
    {
      accessorKey: "champions",
      header: "Şampiyon Sayısı",
    },
    {
      accessorKey: "skins",
      header: "Kostüm Sayısı",
    },
    {
      accessorKey: "blue_essence",
      header: "Mavi Öz",
    },
    {
      accessorKey: "riot_point",
      header: "RP",
    },
    {
      accessorKey: "is_email_verified",
      header: "E-posta Doğrulaması",
    },
    {
      accessorFn: (row) => {
        if (row.users) {
          return row.users.username;
        }
        return row.users;
      },
      header: "Hesabı Alan Kişi",
      enableSorting: false,
    },
    {
      id: "actions",
      header: "İşlemler",
      cell: ({ row }) => (
        <UserActions account={row.original} supabase={supabase} />
      ),
    },
  ];

  return (
    <section className="flex flex-col w-full justify-center items-center h-screen py-4">
      <div className="flex flex-1 flex-col gap-y-5 justify-between max-w-screen-2xl w-full">
        <AvatarHeader supabase={supabase} />
        <DataTable columns={columns} supabase={supabase} />
      </div>
    </section>
  );
}

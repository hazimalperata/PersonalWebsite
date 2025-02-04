"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useMemo, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { TypedSupabaseClient } from "@/types/supabase";
import {
  Pagination,
  PaginationButton,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  DEFAULT_TABLE_PAGE,
  DEFAULT_TABLE_PAGE_SIZE,
} from "@/constants/dataTable";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { getAccounts } from "@/queries/get-accounts";
import { Tables } from "@/database.types";
import RegionFilter, { Region } from "@/app/[locale]/picker/region-filter";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useQuery as useNativeQuery } from "@tanstack/react-query";
import { FormLabel } from "@/components/ui/form";

interface DataTableProps {
  columns: ColumnDef<Tables<"accounts">>[];
  supabase: TypedSupabaseClient;
}

export function DataTable({ columns, supabase }: DataTableProps) {
  const [page, setPage] = useState(DEFAULT_TABLE_PAGE);
  const [pageSize, setPageSize] = useState(DEFAULT_TABLE_PAGE_SIZE);
  const [totalCount, setTotalCount] = useState(0);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [regionFilter, setRegionFilter] = useState<Region | undefined>({
    value: "eune",
  });
  const [userId, setUserId] = useState<string>();

  const { data: user } = useNativeQuery({
    queryKey: ["user"],
    queryFn: async () => await supabase.auth.getUser(),
  });

  const { data, count, isFetching } = useQuery(
    getAccounts(supabase, page, pageSize, sorting, userId, regionFilter),
  );

  const [tableData, setTableData] = useState(data ? data : []);

  const totalPages = useMemo(
    () => Math.ceil(totalCount / pageSize),
    [totalCount, pageSize],
  );

  const isFirstPage = useMemo(() => page <= 1, [page]);
  const isLastPage = useMemo(
    () => page * pageSize >= totalCount,
    [totalCount, page, pageSize],
  );

  const getPaginationItems = () => {
    const pages = [];
    const delta = 2; // Şu anki sayfanın etrafında kaç sayfa gösterilsin?

    if (totalPages <= 7) {
      // Eğer toplam sayfa sayısı 7 veya daha azsa, hepsini göster
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      // Her zaman ilk sayfa eklenir
      pages.push(1);

      if (page > delta + 2) {
        pages.push("ellipsis-start");
      }

      // Mevcut sayfanın etrafında belirli sayıda sayfa göster
      for (
        let i = Math.max(2, page - delta);
        i <= Math.min(totalPages - 1, page + delta);
        i++
      ) {
        pages.push(i);
      }

      if (page < totalPages - (delta + 1)) {
        pages.push("ellipsis-end");
      }

      // Son sayfa her zaman eklenir
      pages.push(totalPages);
    }

    return pages;
  };

  const paginationItems = useMemo(getPaginationItems, [page, totalPages]);

  const table = useReactTable({
    data: tableData,
    columns,
    enableMultiSort: true,
    onSortingChange: setSorting,
    state: {
      sorting,
    },
    getCoreRowModel: getCoreRowModel(),
  });

  useEffect(() => {
    if (!isFetching) {
      setTableData(data ? data : []);
    }
  }, [data, isFetching]);

  useEffect(() => {
    if (count) setTotalCount(count);
  }, [count]);

  useEffect(() => {
    if (user && user.data.user?.id) {
      setUserId(user.data.user.id);
    }
  }, [user]);

  return (
    <div className="flex flex-1 flex-col gap-y-5 justify-between">
      <div className="flex flex-row items-center gap-x-5">
        <RegionFilter region={regionFilter} setRegion={setRegionFilter} />
      </div>
      <div className="flex-1 flex flex-col gap-y-5 justify-between">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const isCanSort = header.column.getCanSort();
                    return (
                      <TableHead
                        className={
                          isCanSort ? "cursor-pointer select-none" : ""
                        }
                        key={header.id}
                        onClick={
                          isCanSort
                            ? header.column.getToggleSortingHandler()
                            : undefined
                        }
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                        {{
                          asc: " 🔼",
                          desc: " 🔽",
                        }[header.column.getIsSorted() as string] ?? null}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isFetching ? (
                <TableRow>
                  {[...new Array(columns.length)].map((_, i) => (
                    <TableCell key={i}>
                      <Skeleton className="h-4" />
                    </TableCell>
                  ))}
                </TableRow>
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    Sonuç yok
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                disabled={isFirstPage}
                onClick={() => setPage((x) => x - 1)}
              />
            </PaginationItem>
            {paginationItems.map((item, index) =>
              item === "ellipsis-start" || item === "ellipsis-end" ? (
                <PaginationItem key={index}>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                <PaginationItem key={index}>
                  <PaginationButton
                    isActive={page === item}
                    onClick={() => setPage(item as number)}
                  >
                    {item}
                  </PaginationButton>
                </PaginationItem>
              ),
            )}
            <PaginationItem>
              <PaginationNext
                disabled={isLastPage}
                onClick={() => setPage((x) => x + 1)}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}

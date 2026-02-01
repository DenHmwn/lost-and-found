"use client";

import React from "react";
import { AppSidebarAdmin } from "../AppSidebarAdmin";
import { SidebarInset, SidebarProvider } from "../ui/sidebar";
import { SiteHeader } from "../SiteHeader";
import { IconUsers } from "@tabler/icons-react";
import { Loader2, Mail, Phone, User as UserIcon, XCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useUsers } from "@/hooks/useUsers";
import { Users } from "@/types/Users";
import SkeletonMember from "../SkeletonListMember";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
import { getPaginationItems, useQueryPagination } from "@/hooks/usePagination";

export default function ListUser() {
  const { page, setPage } = useQueryPagination();
  const { data: users, isLoading, pagination, error } = useUsers(page);

  const totalPages = pagination?.totalPage;

  const handlePrev = () => {
    if (page > 1) return setPage(page - 1);
  };
  const handleNext = () => {
    if (page < totalPages) return setPage(page + 1);
  };

  if (isLoading) {
    return <SkeletonMember />;
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebarAdmin variant="inset" />
      <SidebarInset>
        <SiteHeader />

        <section className="flex flex-1 flex-col gap-6 p-6">
          {/* Header */}
          <header className="space-y-2">
            <section className="flex items-center gap-2">
              <section className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <IconUsers className="h-5 w-5 text-primary" />
              </section>
              <section>
                <h1 className="text-2xl font-bold tracking-tight">List User</h1>
                <p className="text-sm text-muted-foreground">
                  Daftar user yang sudah terdaftar
                </p>
              </section>
            </section>
          </header>

          {error ? (
            /* Error */
            <section className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
              <XCircle className="mx-auto mb-2 h-10 w-10 text-red-600" />
              <p className="font-medium text-red-900">Gagal memuat data user</p>
              <p className="text-sm text-red-700">{error}</p>
            </section>
          ) : (
            /* Table */
            <article>
              <section className="rounded-lg border bg-card shadow-sm">
                <section className="border-b bg-muted/50 px-6 py-4">
                  <h2 className="font-semibold">Daftar User</h2>
                  <p className="text-sm text-muted-foreground">
                    Total {pagination.totalData} user
                  </p>
                </section>

                <section className="overflow-x-auto">
                  <Table className="w-full">
                    <TableHeader>
                      <TableRow className="bg-muted/30">
                        <TableHead className="px-6 py-4 text-xs uppercase">
                          Nama
                        </TableHead>
                        <TableHead className="px-6 py-4 text-xs uppercase">
                          Email
                        </TableHead>
                        <TableHead className="px-6 py-4 text-xs uppercase">
                          No. Telp
                        </TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {users.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={3}
                            className="px-6 py-16 text-center"
                          >
                            <IconUsers className="mx-auto h-12 w-12 text-muted-foreground/50" />
                            <p className="mt-4 font-medium text-muted-foreground">
                              Belum ada user
                            </p>
                          </TableCell>
                        </TableRow>
                      ) : (
                        users.map((user: Users) => (
                          <TableRow
                            key={user.id}
                            className="hover:bg-muted/50 transition"
                          >
                            <TableCell className="px-6 py-4">
                              <section className="flex items-center gap-2">
                                <span className="font-medium">{user.name}</span>
                              </section>
                            </TableCell>

                            <TableCell className="px-6 py-4">
                              <section className="flex items-center gap-2 text-sm">
                                {user.email}
                              </section>
                            </TableCell>

                            <TableCell className="px-6 py-4">
                              <section className="flex items-center gap-2 text-sm">
                                {user.notelp}
                              </section>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </section>
              </section>
            </article>
          )}
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={handlePrev}
                  aria-disabled={page === 1}
                  className={page === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>

              {getPaginationItems(page, totalPages).map((pageItems, index) => (
                <PaginationItem key={index}>
                  {pageItems === "..." ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      isActive={page === pageItems}
                      onClick={() => setPage(pageItems)}
                      className={
                        page === pageItems
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    >
                      {pageItems}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={handleNext}
                  aria-disabled={page === totalPages}
                  className={
                    page === totalPages ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </section>
      </SidebarInset>
    </SidebarProvider>
  );
}

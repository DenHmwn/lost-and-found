"use client";
import React from "react";
import { SidebarInset, SidebarProvider } from "../ui/sidebar";
import { SiteHeader } from "../SiteHeader";
import { AppSidebarUser } from "../AppSidebarUser";
import { IconUsers } from "@tabler/icons-react";
import { useUsers } from "@/hooks/useUsers";
import { Loader2, XCircle } from "lucide-react";
import { Users } from "@/types/users";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

export default function ListAdmin() {
  const { data: users, isLoading, error } = useUsers();

  // filter hanya admin
  const admin = users?.filter((user: Users) => user.role === "ADMIN") || [];

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebarUser variant="inset" />
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
                <h1 className="text-2xl font-bold tracking-tight">List admin</h1>
                <p className="text-sm text-muted-foreground">
                  Daftar admin yang sudah terdaftar
                </p>
              </section>
            </section>
          </header>
          {/* Loading */}
          {isLoading ? (
            <section className="flex h-[400px] items-center justify-center rounded-lg border border-dashed">
              <section className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="text-sm text-muted-foreground">
                  Memuat data...
                </span>
              </section>
            </section>
          ) : error ? (
            /* Error */
            <section className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
              <XCircle className="mx-auto mb-2 h-10 w-10 text-red-600" />
              <p className="font-medium text-red-900">Gagal memuat data admin</p>
              <p className="text-sm text-red-700">{error}</p>
            </section>
          ) : (
            /* Table */
            <section className="rounded-lg border bg-card shadow-sm">
              <section className="border-b bg-muted/50 px-6 py-4">
                <h2 className="font-semibold">Daftar Admin</h2>
                <p className="text-sm text-muted-foreground">
                  Total {admin.length} Admin
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
                    {admin.length === 0 ? (
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
                      admin.map((user: Users) => (
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
          )}
        </section>
      </SidebarInset>
    </SidebarProvider>
  );
}
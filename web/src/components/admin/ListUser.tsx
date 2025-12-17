'use client'
import React from "react";
import { AppSidebarAdmin } from "../AppSidebarAdmin";
import { SidebarInset, SidebarProvider } from "../ui/sidebar";
import { SiteHeader } from "../SiteHeader";
import { IconUsers } from "@tabler/icons-react";
import { Loader2, XCircle } from "lucide-react";
import { useUsers } from "@/hooks/useUsers";

export default function ListUser() {
    const { data: users, isLoading, error } = useUsers();
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
              <p className="font-medium text-red-900">Gagal memuat data user</p>
              <p className="text-sm text-red-700">{error}</p>
            </section>
          ) : (
            /* Table */
            <section className="rounded-lg border bg-card shadow-sm">
              <section className="border-b bg-muted/50 px-6 py-4">
                <h2 className="font-semibold">Daftar User</h2>
                <p className="text-sm text-muted-foreground">
                  Total {users.length} user
                </p>
              </section>
              </section>
          )}
        </section>
      </SidebarInset>
    </SidebarProvider>
  );
}

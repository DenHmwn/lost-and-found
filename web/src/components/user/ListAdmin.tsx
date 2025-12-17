import React from 'react'
import { SidebarInset, SidebarProvider } from '../ui/sidebar';
import { SiteHeader } from '../SiteHeader';
import { AppSidebarUser } from '../AppSidebarUser';
import { IconUsers } from '@tabler/icons-react';

export default function ListAdmin() {
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
                <h1 className="text-2xl font-bold tracking-tight">List User</h1>
                <p className="text-sm text-muted-foreground">
                  Daftar user yang sudah terdaftar
                </p>
              </section>
            </section>
          </header>
          </section>
      </SidebarInset>
    </SidebarProvider>
  );
}
import React from 'react'
import { SidebarInset, SidebarProvider } from '../ui/sidebar';
import { SiteHeader } from '../SiteHeader';
import { AppSidebarUser } from '../AppSidebarUser';

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
        <section className="flex flex-1 flex-col">
          <section className="@container/main flex flex-1 flex-col gap-6 p-6">
          List Admin
          </section>
        </section>
      </SidebarInset>
    </SidebarProvider>
  );
}
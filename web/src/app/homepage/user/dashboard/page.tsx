import { AppSidebarUser } from "@/components/AppSidebarUser";
import { SiteHeader } from "@/components/SiteHeader";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardUserPage() {
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
          <section className="@container/main flex flex-1 flex-col gap-2"></section>
        </section>
      </SidebarInset>
    </SidebarProvider>
  );
}

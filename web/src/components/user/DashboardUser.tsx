import { AppSidebarUser } from "../AppSidebarUser";
import { SiteHeader } from "../SiteHeader";
import { SidebarInset, SidebarProvider } from "../ui/sidebar";

export default function DashboardUser() {
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
          <section className="@container/main flex flex-1 flex-col gap-2">
            <div className="min-h-screen bg-gray-50">
              {/* Header */}
              <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      Dashboard User
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                      Selamat datang kembali
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </section>
      </SidebarInset>
    </SidebarProvider>
  );
}

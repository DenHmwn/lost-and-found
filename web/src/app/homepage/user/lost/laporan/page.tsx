import { AppSidebar } from "@/components/AppSidebar";
import { SiteHeader } from "@/components/SiteHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Textarea } from "@/components/ui/textarea";
import { PackageSearchIcon } from "lucide-react";

export default function LaporanBarangHilangPage() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <section className="flex flex-1 flex-col">
          <section className="@container/main flex flex-1 flex-col gap-6 p-6">
            {/* Header */}
            <header className="space-y-2">
              <section className="flex items-center gap-2">
                <section className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <PackageSearchIcon className="h-5 w-5 text-primary" />
                </section>
                <section>
                  <h1 className="text-2xl font-bold tracking-tight">
                    Buat Laporan Barang Hilang
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Buat Laporan Untuk Barang Anda Yang Hilang Agar Dapat Masuk
                    Ke Dalam List Barang Hilang
                  </p>
                </section>
              </section>
            </header>

            {/* form laporan */}
            <Card>
              <CardHeader>
                <CardTitle className="text-center text-2xl font-bold">
                  Laporan Hilang
                </CardTitle>
                <CardDescription className="text-center">
                  Masukkan Data Barang Anda Disini
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Label className="mx-2 mb-1.5 text-base">Nama Barang</Label>
                <Input
                  maxLength={20}
                  placeholder="Masukkan Nama Barang"
                  className="mb-5"
                ></Input>
                <Label className="mx-2 mb-1.5 text-base ">
                  Lokasi Barang Terakhir Hilang
                </Label>
                <Input
                  maxLength={50}
                  placeholder="Contoh: Gedung A, Ruang 1, Lantai 3"
                  className="mb-5"
                ></Input>
                <Label className="mx-2 mb-1.5 text-base ">
                  Deskripsi Barang
                </Label>
                <Textarea
                  maxLength={250}
                  placeholder="Masukkan Deskripsi Barang"
                  className="mb-5"
                />
              </CardContent>
            </Card>
          </section>
        </section>
      </SidebarInset>
    </SidebarProvider>
  );
}

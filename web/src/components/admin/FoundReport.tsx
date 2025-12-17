"use client";
import { AppSidebarAdmin } from "@/components/AppSidebarAdmin";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Textarea } from "@/components/ui/textarea";
import { ChevronDownIcon, PackageSearchIcon } from "lucide-react";
import React from "react";

export default function LaporanBarangTemu() {
  // State untuk calendar
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date>();

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
                    Buat Laporan Barang Temu
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Buat Laopran Untuk Barang Yang Anda Temui Agar Dapat Masuk
                    Ke Dalam List Barang Temu
                  </p>
                </section>
              </section>
            </header>

            {/* form laporan */}
            <Card>
              <CardHeader>
                <CardTitle className="text-center text-2xl font-bold">
                  Laporan Penemuan
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
                  Lokasi Barang Ditemukan
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
                <section className="flex flex-col gap-4 mb-5">
                  <div>
                    <Label
                      htmlFor="date-picker"
                      className="mx-2 mb-1.5 text-base"
                    >
                      Tanggal
                    </Label>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          id="date-picker"
                          className="w-32 justify-between font-normal"
                        >
                          {date ? date.toLocaleDateString() : "Pilih tanggal"}
                          <ChevronDownIcon />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto overflow-hidden p-0"
                        align="start"
                      >
                        <Calendar
                          mode="single"
                          selected={date}
                          captionLayout="dropdown"
                          onSelect={(date) => {
                            setDate(date);
                            setOpen(false);
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div>
                    <Label htmlFor="time-picker" className="px-1">
                      Waktu
                    </Label>
                    <Input type="time" id="time-picker" step="60" />
                  </div>
                </section>
                <section className=" flex justify-end gap-5">
                  <Button variant="outline">Batal</Button>
                  <Button>Kirim Laporan</Button>
                </section>
              </CardContent>
            </Card>
          </section>
        </section>
      </SidebarInset>
    </SidebarProvider>
  );
}

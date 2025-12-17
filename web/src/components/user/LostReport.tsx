"use client";
import { useState } from "react";
import { AppSidebarUser } from "@/components/AppSidebarUser";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Textarea } from "@/components/ui/textarea";
import { ChevronDownIcon, PackageSearchIcon } from "lucide-react";
import React from "react";

export default function LostReport() {
  // State untuk calendar
  const [namaBarang, setNamaBarang] = useState("");
  const [lokasiHilang, setLokasiHilang] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState("");
  const [open, setOpen] = useState(false);

    const handleSubmit = async () => {
    if (!namaBarang || !lokasiHilang || !deskripsi || !date || !time) {
      alert("Harap lengkapi semua data sebelum mengirim laporan.");
      return;
    }

     try {
      const userId = 2; // Sementara, ganti dengan ID user yang sedang login
      const payload = {
        namaBarang,
        lokasiHilang,
        deskripsi,
        userId,
        tanggal: date.toISOString().split("T")[0],
        waktu: time,
      };

       const res = await fetch("/api/lostreport", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (res.ok) {
        alert("Laporan berhasil dikirim.");
        // Reset form
        setNamaBarang("");
        setLokasiHilang("");
        setDeskripsi("");
        setDate(undefined);
        setTime("");
      } else {
        alert("Gagal mengirim laporan: " + result.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Terjadi kesalahan saat mengirim laporan.");
    }
  };

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
                  value={namaBarang}
                  onChange={(e) => setNamaBarang(e.target.value)}
                  maxLength={20}
                  placeholder="Masukkan Nama Barang"
                  className="mb-5"
                ></Input>
                <Label className="mx-2 mb-1.5 text-base ">Lokasi Barang Terakhir Hilang</Label>
                <Input
                  value={lokasiHilang}
                  onChange={(e) => setLokasiHilang(e.target.value)}
                  maxLength={50}
                  placeholder="Contoh: Gedung A, Ruang 1, Lantai 3"
                  className="mb-5"
                ></Input>
                <Label className="mx-2 mb-1.5 text-base ">Deskripsi Barang</Label>
                <Textarea
                  value={deskripsi}
                  onChange={(e) => setDeskripsi(e.target.value)}
                  maxLength={250}
                  placeholder="Masukkan Deskripsi Barang"
                  className="mb-5"
                />
                <section className="flex flex-col gap-4 mb-5">
                  <section>
                    <Label htmlFor="date-picker" className="mx-2 mb-1.5 text-base">Tanggal
                    </Label>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          id="date-picker"
                          className="w-32 justify-between font-normal">
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
                  </section>

                  <section>
                    <Label htmlFor="time-picker" className="px-1">
                      Waktu
                    </Label>
                    <Input type="time" id="time-picker" step="60" onChange={(e) => setTime(e.target.value)} />
                  </section>
                </section>

                <section className=" flex justify-end gap-5">
                  <Button variant="outline">Batal</Button>
                  <Button onClick={handleSubmit}>Kirim Laporan</Button>
                </section>
              </CardContent>
            </Card>
          </section>
        </section>
      </SidebarInset>
    </SidebarProvider>
  );
}

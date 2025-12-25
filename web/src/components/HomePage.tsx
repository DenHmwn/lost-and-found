"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import {
  CustomButtonOutline,
  CustomButtonPrimary,
} from "./custom/CustomButtonPrimary";

export default function HomePageComponent() {
  const router = useRouter();
  const handleLogin = () => {
    router.push("/login");
  };

  const handleSignup = () => {
    router.push("/signup");
  };
  return (
    <section className="min-h-screen bg-gray-300/70">
      {/* Header */}
      <header className="relative bg-white border-b border-gray-200 shadow-xl">
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5">
          <section className="flex items-center justify-between">
            <section className="text-2xl font-bold text-gray-900">
              XYZ Lost & Found
            </section>
            <section className="flex space-x-3">
              <CustomButtonOutline onClick={handleLogin} label="Login" />
              <CustomButtonPrimary onClick={handleSignup} label="Register" />
            </section>
          </section>
        </section>
      </header>

      {/* Main Content */}
      <article className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-24">
        <section className="text-center space-y-6">
          <h1 className="font-bold text-4xl md:text-5xl text-gray-900 w-fit mx-auto">
            Website Penemuan dan Pelaporan Barang Hilang
          </h1>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Lost and Found adalah platform penemuan dan pelaporan barang hilang
            di Universitas XYZ. Memudahkan mahasiswa dan staff menemukan kembali
            barang mereka.
          </p>

          <section className="flex flex-col sm:flex-row gap-3 justify-center pt-6">
            <Link href="/login">
              <Button className="h-12 px-8 bg-gray-900 text-white font-medium rounded-md hover:bg-gray-800 shadow-md hover:shadow-2xl">
                Laporkan Barang Hilang
              </Button>
            </Link>
            <Link href="/login">
              <Button className="h-12 px-8 bg-white text-gray-900 font-medium rounded-md border border-gray-300 hover:bg-gray-200 shadow-md hover:shadow-2xl">
                Lihat Barang Ditemukan
              </Button>
            </Link>
          </section>
        </section>

        {/* Simple info cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
          <section className="bg-white rounded-lg p-6 border border-gray-200 shadow-md hover:shadow-xl">
            <h3 className="font-semibold text-lg text-gray-900 mb-2">
              Mudah & Cepat
            </h3>
            <p className="text-gray-600 text-sm">
              Laporkan atau temukan barang dalam beberapa klik
            </p>
          </section>

          <section className="bg-white rounded-lg p-6 border border-gray-200  shadow-md hover:shadow-xl">
            <h3 className="font-semibold text-lg text-gray-900 mb-2">
              Aman & Terpercaya
            </h3>
            <p className="text-gray-600 text-sm">
              Data terlindungi dengan aman
            </p>
          </section>

          <section className="bg-white rounded-lg p-6 border border-gray-200 shadow-md hover:shadow-xl">
            <h3 className="font-semibold text-lg text-gray-900 mb-2">
              Komunitas Kampus
            </h3>
            <p className="text-gray-600 text-sm">
              Bergabung dengan mahasiswa dan staff universitas
            </p>
          </section>
        </section>
      </article>
    </section>
  );
}

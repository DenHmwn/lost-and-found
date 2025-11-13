-- CreateEnum
CREATE TYPE "Role" AS ENUM ('User', 'Admin');

-- CreateEnum
CREATE TYPE "JenisLaporan" AS ENUM ('Hilang', 'Ditemukan');

-- CreateEnum
CREATE TYPE "StatusLaporan" AS ENUM ('Diterima', 'Pending', 'Ditolak');

-- CreateTable
CREATE TABLE "tb_user" (
    "id" SERIAL NOT NULL,
    "nama" VARCHAR(50) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "notelp" VARCHAR(50) NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'User',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tb_user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_lost" (
    "id" SERIAL NOT NULL,
    "namaBarang" VARCHAR(50) NOT NULL,
    "lokasiHilang" VARCHAR(255) NOT NULL,
    "deskripsi" VARCHAR(500) NOT NULL,
    "jenis" "JenisLaporan" NOT NULL DEFAULT 'Hilang',
    "status" "StatusLaporan" NOT NULL DEFAULT 'Pending',
    "alasanValidasi" VARCHAR(255),
    "foto" VARCHAR(255),
    "waktuHilang" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approvedAt" TIMESTAMP(3),
    "kontak" VARCHAR(50) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,
    "adminId" INTEGER,

    CONSTRAINT "tb_lost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_found" (
    "id" SERIAL NOT NULL,
    "namaBarang" VARCHAR(50) NOT NULL,
    "lokasiTemu" VARCHAR(255) NOT NULL,
    "deskripsi" VARCHAR(500) NOT NULL,
    "jenis" "JenisLaporan" NOT NULL DEFAULT 'Ditemukan',
    "alasanValidasi" VARCHAR(255),
    "foto" VARCHAR(255),
    "waktuTemu" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "kontak" VARCHAR(50) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "adminId" INTEGER,

    CONSTRAINT "tb_found_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tb_user_email_key" ON "tb_user"("email");

-- CreateIndex
CREATE INDEX "tb_lost_status_idx" ON "tb_lost"("status");

-- CreateIndex
CREATE INDEX "tb_lost_createdAt_idx" ON "tb_lost"("createdAt");

-- CreateIndex
CREATE INDEX "tb_found_createdAt_idx" ON "tb_found"("createdAt");

-- AddForeignKey
ALTER TABLE "tb_lost" ADD CONSTRAINT "tb_lost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "tb_user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_lost" ADD CONSTRAINT "tb_lost_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "tb_user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_found" ADD CONSTRAINT "tb_found_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "tb_user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

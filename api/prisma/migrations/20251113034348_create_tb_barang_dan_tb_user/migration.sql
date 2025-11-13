-- CreateEnum
CREATE TYPE "Role" AS ENUM ('User', 'Admin');

-- CreateEnum
CREATE TYPE "JenisLaporan" AS ENUM ('Hilang', 'Ditemukan');

-- CreateEnum
CREATE TYPE "StatusLaporan" AS ENUM ('Diterima', 'Diproses', 'Ditolak');

-- CreateTable
CREATE TABLE "tb_user" (
    "id" SERIAL NOT NULL,
    "nama" VARCHAR(50) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'User',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tb_user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_barang" (
    "id" SERIAL NOT NULL,
    "namabarang" VARCHAR(50) NOT NULL,
    "lokasi" VARCHAR(255) NOT NULL,
    "notelp" VARCHAR(20) NOT NULL,
    "deskripsi" VARCHAR(500) NOT NULL,
    "jenis" "JenisLaporan" NOT NULL,
    "status" "StatusLaporan" NOT NULL,
    "foto" VARCHAR(255),
    "waktu" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    "adminId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tb_barang_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tb_user_email_key" ON "tb_user"("email");

-- AddForeignKey
ALTER TABLE "tb_barang" ADD CONSTRAINT "tb_barang_userId_fkey" FOREIGN KEY ("userId") REFERENCES "tb_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_barang" ADD CONSTRAINT "tb_barang_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "tb_user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

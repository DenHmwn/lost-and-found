/*
  Warnings:

  - You are about to alter the column `deskripsi` on the `FoundReport` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `lokasiTemu` on the `FoundReport` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `namaBarang` on the `FoundReport` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(25)`.
  - You are about to alter the column `deskripsi` on the `LostReport` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `lokasiHilang` on the `LostReport` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `namaBarang` on the `LostReport` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(25)`.
  - You are about to alter the column `name` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `password` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(25)`.

*/
-- CreateEnum
CREATE TYPE "StatusReport" AS ENUM ('Done', 'OnProgress', 'Closed');

-- AlterTable
ALTER TABLE "FoundReport" ADD COLUMN     "statusReport" "StatusReport" NOT NULL DEFAULT 'OnProgress',
ALTER COLUMN "deskripsi" DROP DEFAULT,
ALTER COLUMN "deskripsi" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "lokasiTemu" DROP DEFAULT,
ALTER COLUMN "lokasiTemu" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "namaBarang" DROP DEFAULT,
ALTER COLUMN "namaBarang" SET DATA TYPE VARCHAR(25);

-- AlterTable
ALTER TABLE "LostReport" ADD COLUMN     "statusReport" "StatusReport" NOT NULL DEFAULT 'OnProgress',
ALTER COLUMN "deskripsi" DROP DEFAULT,
ALTER COLUMN "deskripsi" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "lokasiHilang" DROP DEFAULT,
ALTER COLUMN "lokasiHilang" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "namaBarang" DROP DEFAULT,
ALTER COLUMN "namaBarang" SET DATA TYPE VARCHAR(25);

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "notelp" VARCHAR(15) NOT NULL DEFAULT '081234567890',
ALTER COLUMN "name" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "password" SET DATA TYPE VARCHAR(25);

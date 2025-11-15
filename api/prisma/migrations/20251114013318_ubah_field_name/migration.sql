/*
  Warnings:

  - You are about to drop the column `description` on the `FoundReport` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `FoundReport` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `FoundReport` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `LostReport` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `LostReport` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `LostReport` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "FoundReport" DROP COLUMN "description",
DROP COLUMN "location",
DROP COLUMN "title",
ADD COLUMN     "deskripsi" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "lokasiTemu" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "namaBarang" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "LostReport" DROP COLUMN "description",
DROP COLUMN "location",
DROP COLUMN "title",
ADD COLUMN     "deskripsi" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "lokasiHilang" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "namaBarang" TEXT NOT NULL DEFAULT '';

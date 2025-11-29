/*
  Warnings:

  - A unique constraint covering the columns `[notelp]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "notelp" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "User_notelp_key" ON "User"("notelp");

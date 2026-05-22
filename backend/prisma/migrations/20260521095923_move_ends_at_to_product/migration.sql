/*
  Warnings:

  - You are about to drop the column `endsAt` on the `Banner` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Banner" DROP COLUMN "endsAt";

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "endsAt" TIMESTAMP(3);

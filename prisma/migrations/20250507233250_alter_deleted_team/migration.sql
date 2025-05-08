/*
  Warnings:

  - You are about to drop the column `removedAt` on the `Team` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Team" DROP COLUMN "removedAt",
ADD COLUMN     "deletedAt" TIMESTAMP(3);

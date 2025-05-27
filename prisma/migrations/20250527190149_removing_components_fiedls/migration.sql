/*
  Warnings:

  - You are about to drop the column `componentButtons` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `componentFooter` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `componentHeader` on the `Message` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Message" DROP COLUMN "componentButtons",
DROP COLUMN "componentFooter",
DROP COLUMN "componentHeader";

/*
  Warnings:

  - Added the required column `externalChannelId` to the `Conversation` table without a default value. This is not possible if the table is not empty.
  - Made the column `externalId` on table `Conversation` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Conversation" ADD COLUMN     "externalChannelId" TEXT NOT NULL,
ALTER COLUMN "externalId" SET NOT NULL;

-- CreateIndex
CREATE INDEX "Conversation_externalId_externalChannelId_idx" ON "Conversation"("externalId", "externalChannelId");

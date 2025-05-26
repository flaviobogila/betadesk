-- AlterTable
ALTER TABLE "MessageTemplate" ADD COLUMN     "externalId" TEXT,
ADD COLUMN     "reason" TEXT,
ALTER COLUMN "updatedAt" DROP NOT NULL;

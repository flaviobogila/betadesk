-- AlterEnum
ALTER TYPE "ConversationStatus" ADD VALUE 'start_failed';

-- AlterTable
ALTER TABLE "Message" ALTER COLUMN "mediaStatus" DROP NOT NULL,
ALTER COLUMN "mediaStatus" DROP DEFAULT;

-- CreateEnum
CREATE TYPE "MediaStatus" AS ENUM ('pending', 'downloading', 'downloaded', 'failed');

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "mediaId" TEXT,
ADD COLUMN     "mediaStatus" "MediaStatus" NOT NULL DEFAULT 'pending';

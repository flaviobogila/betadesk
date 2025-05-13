-- CreateEnum
CREATE TYPE "LogType" AS ENUM ('CREATED', 'STATUS_CHANGE', 'AGENT_CHANGE', 'TEAM_CHANGE', 'LABEL_ADDED', 'LABEL_REMOVED', 'CUSTOM');

-- CreateTable
CREATE TABLE "ConversationLog" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "type" "LogType" NOT NULL,
    "from" TEXT,
    "to" TEXT,
    "performedBy" TEXT,
    "comment" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConversationLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ConversationLog_conversationId_createdAt_idx" ON "ConversationLog"("conversationId", "createdAt");

-- AddForeignKey
ALTER TABLE "ConversationLog" ADD CONSTRAINT "ConversationLog_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

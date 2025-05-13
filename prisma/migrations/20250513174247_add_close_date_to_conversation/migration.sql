-- AlterTable
ALTER TABLE "Conversation" ADD COLUMN     "closedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "ConversationParticipant" ALTER COLUMN "role" SET DEFAULT 'assignee';

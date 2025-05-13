import { Module } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { ConversationsController } from './conversations.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { MessagesModule } from 'src/messages/messages.module';
import { ConversationsLogService } from './conversations-logs.service';

@Module({
  imports: [MessagesModule],
  controllers: [ConversationsController],
  providers: [ConversationsService, ConversationsLogService, PrismaService],
  exports: [ConversationsService],
})
export class ConversationsModule {}

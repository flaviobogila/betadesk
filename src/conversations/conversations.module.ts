import { forwardRef, Module } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { ConversationsController } from './conversations.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { MessagesModule } from 'src/messages/messages.module';
import { ConversationsLogService } from './conversations-logs.service';
import { ChannelsModule } from 'src/channels/channels.module';
import { ContactsModule } from 'src/contacts/contacts.module';

@Module({
  imports: [forwardRef(() => MessagesModule), ChannelsModule, ContactsModule],
  controllers: [ConversationsController],
  providers: [ConversationsService, ConversationsLogService, PrismaService],
  exports: [ConversationsService],
})
export class ConversationsModule {}

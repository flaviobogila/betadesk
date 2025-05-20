import { forwardRef, Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { WhatsappService } from './whatsapp.service';
import { WhatsappController } from './whatsapp.controller';
import { MessageService } from './message.service';
import { MessageFactoryService } from './message-factory.service';
import { ChannelsModule } from 'src/channels/channels.module';
import { MessageDispatcherService } from './message-dispatcher.service';
import { MessageCommandRegistry } from './registry/message-command.registry';
import { MessagesController } from './messages.controller';
import { BullMQService } from './queues/bullmq/bullmq.service';
import { BullMQChatService } from './queues/bullmq/conversation.bullmq.service';
import { ConversationsModule } from 'src/conversations/conversations.module';

@Module({
  imports: [ChannelsModule, forwardRef(() => ConversationsModule)],
  controllers: [WhatsappController, MessagesController],
  providers: [WhatsappService, MessageService, MessageFactoryService, PrismaService, MessageDispatcherService, MessageCommandRegistry, BullMQService, BullMQChatService],
  exports: [MessageService, WhatsappService, BullMQService, BullMQChatService],
})
export class MessagesModule {}
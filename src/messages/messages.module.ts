import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { WhatsappService } from './whatsapp.service';
import { WhatsappController } from './whatsapp.controller';
import { MessageService } from './message.service';
import { MessageFactoryService } from './message-factory.service';
import { ChannelsModule } from 'src/channels/channels.module';
import { MessageDispatcherService } from './message-dispatcher.service';
import { MessageCommandRegistry } from './registry/message-command.registry';
import { MessagesController } from './messages.controller';

@Module({
  imports: [ChannelsModule, MessagesModule],
  controllers: [WhatsappController, MessagesController],
  providers: [WhatsappService, MessageService, MessageFactoryService, PrismaService, MessageDispatcherService, MessageCommandRegistry],
  exports: [MessageService, WhatsappService],
})
export class MessagesModule {}
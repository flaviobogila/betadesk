import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { WhatsappService } from './whatsapp.service';
import { WhatsappController } from './whatsapp.controller';
import { MessageService } from './message.service';
import { MessageFactoryService } from './message-factory.service';
import { ChannelsModule } from 'src/channels/channels.module';

@Module({
  imports: [ChannelsModule],
  controllers: [WhatsappController],
  providers: [WhatsappService, MessageService, MessageFactoryService, PrismaService],
  exports: [MessageService, WhatsappService],
})
export class MessagesModule {}
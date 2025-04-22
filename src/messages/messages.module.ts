import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { WhatsappService } from './whatsapp.service';
import { WhatsappController } from './whatsapp.controller';
import { ChannelsService } from 'src/channels/channels.service';
import { MessageFactoryService } from './message-factory.service';
import { MessageService } from './message.service';

@Module({
  controllers: [WhatsappController],
  providers: [ChannelsService, WhatsappService, MessageService, MessageFactoryService, PrismaService],
})
export class MessagesModule {}
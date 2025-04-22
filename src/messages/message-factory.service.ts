import { Injectable, BadRequestException } from '@nestjs/common';
import { MessageType } from './dto/message-type.enum';
import { SendImageMessageDto } from './dto/send-image-message.dto';
import { SendTemplateMessageDto } from './dto/send-template-message.dto';
import { SendTextMessageDto } from './dto/send-text-message.dto';
import { WhatsappService } from './whatsapp.service';
import { Prisma } from 'prisma/generated/prisma/client';
import { InputJsonValue } from 'prisma/generated/prisma/runtime/library';
import { MessageService } from './message.service';
import { SupabaseUser } from 'src/common/interfaces/supabase-user.interface';

@Injectable()
export class MessageFactoryService {
  constructor(private readonly messageService: MessageService, private readonly whatsappService: WhatsappService) {}

  store(
    messageType: MessageType,
    dto: any,
    sender: SupabaseUser
  ){
    switch (messageType) {
      case MessageType.text:
        return this.messageService.createMessage(this.buildTextMessage(dto as SendTextMessageDto, sender));

      case MessageType.image:
        return this.messageService.createMessage(this.buildImageMessage(dto as SendImageMessageDto, sender));

      case MessageType.template:
        return this.messageService.createMessage(this.buildTemplateMessage(dto as SendTemplateMessageDto, sender));

      default:
        throw new BadRequestException(`Tipo de mensagem não suportado: ${messageType}`);
    }
  }

  send(messageType: MessageType, dto: any) {
    switch (messageType) {
      case MessageType.text:
        return this.whatsappService.sendTextMessage(dto as SendTextMessageDto);

      case MessageType.image:
        return this.whatsappService.sendImageMessage(dto as SendImageMessageDto);

      case MessageType.template:
        return this.whatsappService.sendTemplateMessage(dto as SendTemplateMessageDto);

      default:
        throw new BadRequestException(`Tipo de mensagem '${messageType}' não suportado.`);
    }
  }

  private buildTextMessage(dto: SendTextMessageDto, sender: SupabaseUser): Prisma.MessageCreateInput {
    return {
      conversation: { connect: { id: dto.conversationId } },
      senderType: 'agent',
      senderId: sender.id,
      senderName: sender?.name,
      messageType: 'text',
      content: dto.content,
      status: 'pending',
    };
  }

  private buildImageMessage(dto: SendImageMessageDto, sender: SupabaseUser): Prisma.MessageCreateInput {
    return {
      conversation: { connect: { id: dto.conversationId } },
      senderType: 'agent',
      senderId: sender.id,
      senderName: sender?.name,
      messageType: 'image',
      mediaUrl: dto.imageUrl,
      mediaCaption: dto.caption,
      status: 'pending',
    };
  }

  private buildTemplateMessage(dto: SendTemplateMessageDto, sender: SupabaseUser): Prisma.MessageCreateInput {
    return {
      conversation: { connect: { id: dto.conversationId } },
      senderType: 'agent',
      senderId: sender.id,
      senderName: sender?.name,
      messageType: 'template',
      metadata: {
        templateName: dto.templateName,
        languageCode: dto.languageCode,
        components: dto.components,
      } as unknown as InputJsonValue,
      status: 'pending',
    };
  }
}

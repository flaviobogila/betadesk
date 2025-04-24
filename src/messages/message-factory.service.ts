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
import { SendAudioMessageDto } from './dto/send-audio-message.dto';
import { SendVideoMessageDto } from './dto/send-video-message.dto';
import { SendDocumentMessageDto } from './dto/send-document-message.dto';
import { SendLocationMessageDto } from './dto/send-location-message.dto';
import { SendStickerMessageDto } from './dto/send-sticker-message.dto';
import { SendButtonMessageDto } from './dto/send-button-message.dto';
import { SendComponentMessageDto } from './dto/send-component-message.dto';

@Injectable()
export class MessageFactoryService {
  constructor(private readonly messageService: MessageService, private readonly whatsappService: WhatsappService) {}

  async storeAndSendToWhatsapp(
    messageType: MessageType,
    dto: any,
    sender: SupabaseUser
  ) {
    const message = await this.store(messageType, dto, sender);
    const messageSent = await this.sendToWhatsapp(messageType, dto);
    await this.messageService.updateMessageStatus(message.id, 'sent', { metadata: messageSent });
    return { ...message, status: 'sent', metadata: messageSent };
  }

  store(
    messageType: MessageType,
    dto: any,
    sender: SupabaseUser
  ){
    switch (messageType) {
      case MessageType.text:
        return this.messageService.createIfNotExists(
          this.buildTextMessage(dto as SendTextMessageDto, sender),
          dto.conversationId
        );
    
      case MessageType.image:
        return this.messageService.createIfNotExists(
          this.buildImageMessage(dto as SendImageMessageDto, sender),
          dto.conversationId
        );
    
      case MessageType.audio:
        return this.messageService.createIfNotExists(
          this.buildAudioMessage(dto as SendAudioMessageDto, sender),
          dto.conversationId
        );
    
      case MessageType.video:
        return this.messageService.createIfNotExists(
          this.buildVideoMessage(dto as SendVideoMessageDto, sender),
          dto.conversationId
        );
    
      case MessageType.document:
        return this.messageService.createIfNotExists(
          this.buildDocumentMessage(dto as SendDocumentMessageDto, sender),
          dto.conversationId
        );
    
      case MessageType.sticker:
        return this.messageService.createIfNotExists(
          this.buildStickerMessage(dto as SendStickerMessageDto, sender),
          dto.conversationId
        );
    
      case MessageType.location:
        return this.messageService.createIfNotExists(
          this.buildLocationMessage(dto as SendLocationMessageDto, sender),
          dto.conversationId
        );
    
      case MessageType.button:
        return this.messageService.createIfNotExists(
          this.buildButtonMessage(dto as SendButtonMessageDto, sender),
          dto.conversationId
        );
    
      case MessageType.template:
        return this.messageService.createIfNotExists(
          this.buildTemplateMessage(dto as SendTemplateMessageDto, sender),
          dto.conversationId
        );
    
      case MessageType.component:
        return this.messageService.createIfNotExists(
          this.buildComponentMessage(dto as SendComponentMessageDto, sender),
          dto.conversationId
        );
    
      default:
        throw new BadRequestException(`Tipo de mensagem não suportado: ${messageType}`);
    }
    
  }

  sendToWhatsapp(messageType: MessageType, dto: any) {
    switch (messageType) {
      case MessageType.text:
        return this.whatsappService.sendTextMessage(dto as SendTextMessageDto);
    
      case MessageType.image:
        return this.whatsappService.sendImageMessage(dto as SendImageMessageDto);
    
      case MessageType.audio:
        return this.whatsappService.sendAudioMessage(dto as SendAudioMessageDto);
    
      case MessageType.video:
        return this.whatsappService.sendVideoMessage(dto as SendVideoMessageDto);
    
      case MessageType.document:
        return this.whatsappService.sendDocumentMessage(dto as SendDocumentMessageDto);
    
      case MessageType.sticker:
        return this.whatsappService.sendStickerMessage(dto as SendStickerMessageDto);
    
      case MessageType.location:
        return this.whatsappService.sendLocationMessage(dto as SendLocationMessageDto);
    
      case MessageType.button:
        return this.whatsappService.sendButtonMessage(dto as SendButtonMessageDto);
    
      case MessageType.template:
        return this.whatsappService.sendTemplateMessage(dto as SendTemplateMessageDto);
    
      case MessageType.component:
        return this.whatsappService.sendComponentMessage(dto as SendComponentMessageDto);
    
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

  private buildAudioMessage(dto: SendAudioMessageDto, sender: SupabaseUser): Prisma.MessageCreateInput {
    return {
      conversation: { connect: { id: dto.conversationId } },
      senderType: 'agent',
      senderId: sender.id,
      senderName: sender.name,
      messageType: 'audio',
      mediaUrl: dto.audioUrl,
      mediaMimeType: dto.mimeType,
      mediaDuration: dto.duration,
      status: 'pending',
    };
  }
  
  private buildVideoMessage(dto: SendVideoMessageDto, sender: SupabaseUser): Prisma.MessageCreateInput {
    return {
      conversation: { connect: { id: dto.conversationId } },
      senderType: 'agent',
      senderId: sender.id,
      senderName: sender.name,
      messageType: 'video',
      mediaUrl: dto.videoUrl,
      mediaCaption: dto.caption,
      mediaMimeType: dto.mimeType,
      mediaDuration: dto.duration,
      status: 'pending',
    };
  }
  
  private buildDocumentMessage(dto: SendDocumentMessageDto, sender: SupabaseUser): Prisma.MessageCreateInput {
    return {
      conversation: { connect: { id: dto.conversationId } },
      senderType: 'agent',
      senderId: sender.id,
      senderName: sender.name,
      messageType: 'document',
      mediaUrl: dto.documentUrl,
      mediaMimeType: dto.mimeType,
      metadata: {
        filename: dto.filename,
      } as unknown as InputJsonValue,
      status: 'pending',
    };
  }
  
  private buildLocationMessage(dto: SendLocationMessageDto, sender: SupabaseUser): Prisma.MessageCreateInput {
    return {
      conversation: { connect: { id: dto.conversationId } },
      senderType: 'agent',
      senderId: sender.id,
      senderName: sender.name,
      messageType: 'location',
      metadata: {
        latitude: dto.latitude,
        longitude: dto.longitude,
        name: dto.name,
        address: dto.address,
      } as unknown as InputJsonValue,
      status: 'pending',
    };
  }
  
  private buildStickerMessage(dto: SendStickerMessageDto, sender: SupabaseUser): Prisma.MessageCreateInput {
    return {
      conversation: { connect: { id: dto.conversationId } },
      senderType: 'agent',
      senderId: sender.id,
      senderName: sender.name,
      messageType: 'sticker',
      mediaUrl: dto.stickerUrl,
      mediaMimeType: dto.mimeType,
      status: 'pending',
    };
  }
  
  private buildButtonMessage(dto: SendButtonMessageDto, sender: SupabaseUser): Prisma.MessageCreateInput {
    return {
      conversation: { connect: { id: dto.conversationId } },
      senderType: 'agent',
      senderId: sender.id,
      senderName: sender.name,
      messageType: 'button',
      content: dto.text,
      metadata: {
        buttons: dto.buttons, // [{ type, text, payload }]
      } as unknown as InputJsonValue,
      status: 'pending',
    };
  }
  
  private buildComponentMessage(dto: SendComponentMessageDto, sender: SupabaseUser): Prisma.MessageCreateInput {
    return {
      conversation: { connect: { id: dto.conversationId } },
      senderType: 'agent',
      senderId: sender.id,
      senderName: sender.name,
      messageType: 'component',
      componentHeader: dto.header,
      content: dto.body,
      componentFooter: dto.footer,
      componentButtons: dto.buttons,
      status: 'pending',
    };
  }
  
}

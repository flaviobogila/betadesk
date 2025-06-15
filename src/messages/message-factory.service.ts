import { Injectable, BadRequestException } from '@nestjs/common';
import { SendImageMessageDto } from './dto/send-image-message.dto';
import { SendTemplateMessageDto } from './dto/send-template-message.dto';
import { SendTextMessageDto } from './dto/send-text-message.dto';
import { MessageType, Prisma } from 'prisma/generated/prisma/client';
import { InputJsonValue } from 'prisma/generated/prisma/runtime/library';
import { SupabaseUser } from 'src/common/interfaces/supabase-user.interface';
import { SendAudioMessageDto } from './dto/send-audio-message.dto';
import { SendVideoMessageDto } from './dto/send-video-message.dto';
import { SendDocumentMessageDto } from './dto/send-document-message.dto';
import { SendLocationMessageDto } from './dto/send-location-message.dto';
import { SendStickerMessageDto } from './dto/send-sticker-message.dto';
import { SendButtonMessageDto } from './dto/send-button-message.dto';
import { SendComponentMessageDto } from './dto/send-component-message.dto';
import { SendListButtonMessageDto } from './dto/send-list-button-message.dto';
import { SendContactMessageDto } from './dto/send-contact-message.dto';

@Injectable()
export class MessageFactoryService {

  buildModelMessage(
    messageType: MessageType,
    dto: any,
    sender: SupabaseUser
  ): Prisma.MessageCreateInput {
    switch (messageType) {
      case MessageType.text:
        return this.buildTextMessage(dto as SendTextMessageDto, sender)

      case MessageType.image:
        return this.buildImageMessage(dto as SendImageMessageDto, sender)

      case MessageType.audio:
        return this.buildAudioMessage(dto as SendAudioMessageDto, sender)

      case MessageType.video:
        return this.buildVideoMessage(dto as SendVideoMessageDto, sender)

      case MessageType.document:
        return this.buildDocumentMessage(dto as SendDocumentMessageDto, sender)

      case MessageType.sticker:
        return this.buildStickerMessage(dto as SendStickerMessageDto, sender)

      case MessageType.location:
        return this.buildLocationMessage(dto as SendLocationMessageDto, sender)

      case MessageType.buttons:
        return this.buildButtonMessage(dto as SendButtonMessageDto, sender);

      case MessageType.template:
        return this.buildTemplateMessage(dto as SendTemplateMessageDto, sender)

      case MessageType.component:
        return this.buildComponentMessage(dto as SendComponentMessageDto, sender)

      case MessageType.list:
        return this.buildButtonListMessage(dto as SendListButtonMessageDto, sender)

      case MessageType.contacts:
        return this.buildContactMessage(dto as SendContactMessageDto, sender)

      default:
        throw new BadRequestException(`Tipo de mensagem não suportada: ${messageType}`);
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
      status: dto.isPrivate ? 'sent' : 'pending',
      replyTo: dto.replyTo ? { connect: { id: dto.replyTo } } : undefined,
      isPrivate: dto.isPrivate ? true : false
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
      mediaSize: dto.size,
      mediaMimeType: dto.mimeType,
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
      components: this.fillComponentsFromTemplateMessage(dto.parameters, dto.components),
      metadata: {
        template: {
          id: dto.templateId,
          name: dto.templateName
        }
      } as unknown as InputJsonValue,
      status: 'pending'
    };
  }

  private fillComponentsFromTemplateMessage(parameters: any, components: any) {
    Object.entries(components).map(([componentKey, componentValue]: [string, any]) => {
      if (parameters[componentKey] && componentKey == 'header' || componentKey == 'body') {
        Object.entries(parameters[componentKey]).forEach(([paramKey, paramValue]) => {
          if (componentValue?.type == 'text' || componentKey == 'body') {
            components[componentKey]['text'] = components[componentKey]['text'].replace(`{{${paramKey}}}`, paramValue);
            delete components[componentKey]['example'];
          }
          if (['image', 'video', 'document'].includes(componentValue?.type)) {
            components[componentKey][componentValue?.type]['link'] = paramValue;
            delete components[componentKey]['example'];
          }
        });
      }
      if (parameters[componentKey] && componentKey == 'buttons') {
        const buttons = components[componentKey].filter((button: any) => button.example);
        buttons.forEach((button: any, index: number) => {
          delete button.example;
          if (button.type == 'url') {
            button.url = button.url.replace(`{{1}}`, parameters[componentKey][index]);
          }
          if (button.type == 'copy_code') {
            button.copy_code = parameters[componentKey][index];
          }
        });
      }
    });

    return components;
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
      mediaSize: dto.size,
      metadata: {
        waveBars: dto.waveBars,
      } as unknown as InputJsonValue,
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
      mediaSize: dto.size,
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
      mediaCaption: dto.caption,
      mediaMimeType: dto.mimeType,
      mediaSize: dto.size,
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
        location: {
          latitude: dto.latitude,
          longitude: dto.longitude,
          name: dto.name,
          address: dto.address,
        }
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
      messageType: 'buttons',
      content: dto.content,
      metadata: {
        buttons: dto.buttons, // [{ type, text, payload }]
      } as unknown as InputJsonValue,
      status: 'pending',
    };
  }

  private buildButtonListMessage(dto: SendListButtonMessageDto, sender: SupabaseUser): Prisma.MessageCreateInput {
    return {
      conversation: { connect: { id: dto.conversationId } },
      senderType: 'agent',
      senderId: sender.id,
      senderName: sender.name,
      messageType: 'list',
      content: dto.content,
      metadata: {
        header: dto.header ?? undefined,
        footer: dto.footer ?? undefined,
        buttonText: dto.buttonText,
        items: dto.items,
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
      components: {
        header: dto.header,
        body: dto.body,
        footer: dto.footer,
        buttons: dto.buttons,
      },
      content: dto.body,
      status: 'pending',
    };
  }

  private buildContactMessage(dto: SendContactMessageDto, sender: SupabaseUser): Prisma.MessageCreateInput {
    return {
      conversation: { connect: { id: dto.conversationId } },
      senderType: 'agent',
      senderId: sender.id,
      senderName: sender.name,
      messageType: 'contacts',
      metadata: {
        contact: dto.contacts[0]
      } as unknown as InputJsonValue,
      status: 'pending',
    };
  }

}

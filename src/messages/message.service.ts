import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from 'prisma/generated/prisma/client';
import { MessageFactoryService } from './message-factory.service';
import { SupabaseUser } from 'src/common/interfaces/supabase-user.interface';
import { WhatsAppMediaDownloadResponse } from 'src/webhook/dto/whatsapp-webhook.dto';
import { MessageEntity } from './entities/message.entity';
import { plainToInstance } from 'class-transformer';
import { SendTemplateMessageDto } from './dto/send-template-message.dto';
import { ConversationsService } from 'src/conversations/conversations.service';

@Injectable()
export class MessageService {
  constructor(private readonly prisma: PrismaService, private readonly factory: MessageFactoryService, private readonly conversationService: ConversationsService) { }

  async save(messageDto: any, user: SupabaseUser) {
    
    //caso seja um template que será enviado fora de uma conversa
    //por exemplo em um disparo em massa, ou novo contato
    if(this.isOutOfConversationMessageTemplate(messageDto)){
      return this.saveTemplate(messageDto, user)
    }
    return this.saveMessage(messageDto, user);
  }

  private async saveMessage(messageDto: any, user: SupabaseUser) {

    const entityMessage = await this.factory.buildModelMessage(messageDto.messageType, messageDto, user);
    if (messageDto.isPrivate) {
      return this.createPrivateMessageWithMention(entityMessage, messageDto.mentionedUserId!);
    }
    return this.create(entityMessage);
  }

  private async saveTemplate(messageDto: SendTemplateMessageDto, user: SupabaseUser) {

    const { channelId, to, messageType } = messageDto;

    const conversation = await this.conversationService
      .findOneActiveOrCreateByChannelId({
        channelId,
        clientPhone: to,
        clientName: to,
        origin: 'user'
      });

    messageDto.conversationId = conversation!.id;

    const model = await this.factory.buildModelMessage(messageType, messageDto, user);

    return this.create(model);
  }

  private isOutOfConversationMessageTemplate( messageDto: any){
    return !messageDto.conversationId && messageDto.messageType == 'template';
  }

  private create(data: Prisma.MessageCreateInput) {
    return this.prisma.message.create({ data, include: { replyTo: true } });
  }

  private createPrivateMessageWithMention(data: Prisma.MessageCreateInput, mentionedUserId: string) {
    return this.prisma.$transaction(async (tx) => {
      const message = await tx.message.create({
        data, include: { replyTo: true }
      });
      const mention = await tx.mention.create({
        data: {
          messageId: message.id,
          mentionedId: mentionedUserId,
        },
      });
      return message;
    });
  }

  async upsert(input: Prisma.MessageCreateInput, conversationId: string, messageReplyExternalId?: string) {
    const existing = await this.prisma.message.findFirst({
      where: {
        conversationId: conversationId,
        senderType: 'user',
        externalId: input.externalId,
      },
    });

    if (existing) {
      return existing;
    }

    if (messageReplyExternalId) {
      const replyMessage = await this.prisma.message.findFirst({
        where: {
          conversationId: conversationId,
          externalId: messageReplyExternalId,
        },
      });

      if (replyMessage) {
        return this.prisma.message.create({
          data: {
            ...input, conversation: {
              connect: { id: conversationId },
            },
            replyTo: {
              connect: { id: replyMessage.id },
            }
          },
          include: { replyTo: true }
        });
      }
    }

    return this.prisma.message.create({
      data: {
        ...input, conversation: {
          connect: { id: conversationId },
        }
      }
    });

  }

  async updateReaction(
    input: Prisma.MessageCreateInput,
  ) {
    const { metadata } = input;
    const { emoji, messageId } = metadata as any;

    const message = await this.prisma.message.findFirst({
      where: { externalId: messageId },
    });

    if (!message) {
      return null;
    }

    const currentMetadata = (message.metadata || {}) as Prisma.JsonObject;
    const newMetadata = (metadata || {}) as Prisma.JsonObject;

    const mergedMetadata: Prisma.JsonObject = {
      ...currentMetadata,
      ...newMetadata,
    };

    return this.prisma.message.update({
      where: { id: message?.id },
      data: {
        reaction: emoji,
        metadata: mergedMetadata
      },
    });
  }

  async updateMessageStatus(
    id: string,
    status: 'sent' | 'failed' | 'delivered' | 'read',
    extras?: Partial<Pick<Prisma.MessageUpdateInput, 'metadata' | 'externalId'>>,
  ) {
    const message = await this.prisma.message.findUnique({
      where: { id },
    });

    if (!message) {
      return null;
    }

    if (extras?.metadata) {

      const currentMetadata = (message.metadata || {}) as Prisma.JsonObject;
      const newMetadata = (extras.metadata || {}) as Prisma.JsonObject;

      const mergedMetadata: Prisma.JsonObject = {
        ...currentMetadata,
        ...newMetadata,
      };

      extras.metadata = mergedMetadata;
    }

    return this.prisma.message.update({
      where: { id: message?.id },
      data: {
        status,
        ...extras,
      },
    });
  }

  async updateMessageStatusByExternalId(
    externalId: string,
    status: 'sent' | 'failed' | 'delivered' | 'read',
    extras?: Partial<Pick<Prisma.MessageUpdateInput, 'metadata' | 'externalId'>>,
  ) {
    const message = await this.prisma.message.findFirst({
      where: { externalId },
    });

    if (!message) {
      return null;
    }

    if (extras?.metadata) {

      const currentMetadata = (message.metadata || {}) as Prisma.JsonObject;
      const newMetadata = (extras.metadata || {}) as Prisma.JsonObject;

      const mergedMetadata: Prisma.JsonObject = {
        ...currentMetadata,
        ...newMetadata,
      };

      extras.metadata = mergedMetadata;
    }

    return this.prisma.message.update({
      where: { id: message?.id },
      data: {
        status,
        ...extras,
      },
    });
  }

  updateMedia(id: string, media: WhatsAppMediaDownloadResponse) {
    const { mime_type, file_size, url, caption } = media;
    return this.prisma.message.update({
      where: { id },
      data: {
        mediaMimeType: mime_type,
        mediaSize: file_size,
        mediaUrl: url,
        mediaCaption: caption,
        mediaStatus: 'downloaded'
      },
    });
  }

  updateMediaStatus(id: string, status: 'downloaded' | 'failed' | 'downloading') {
    return this.prisma.message.update({
      where: { id },
      data: {
        mediaStatus: status
      },
    });
  }

  async findAll(conversationId: string) {
    return this.prisma.message.findMany({
      where: { conversationId },
      include: {
        replyTo: true,
        mentions: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}

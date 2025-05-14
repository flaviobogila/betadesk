import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from 'prisma/generated/prisma/client';
import { MessageFactoryService } from './message-factory.service';
import { SendMessageBaseDto } from './dto/send-message.dto';
import { SupabaseUser } from 'src/common/interfaces/supabase-user.interface';
import { WhatsAppMediaDownloadResponse } from 'src/webhook/dto/whatsapp-webhook.dto';

@Injectable()
export class MessageService {
  constructor(private readonly prisma: PrismaService, private readonly factory: MessageFactoryService) { }

  async create(data: Prisma.MessageCreateInput) {
    return this.prisma.message.create({ data, include: { replyTo: true } });
  }

  async createPrivateMessageWithMention(data: Prisma.MessageCreateInput, mentionedUserId: string) {
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
      return { message, mention };
    });
  }

  async buildAndCreate(messageDto: SendMessageBaseDto, user: SupabaseUser) {
    const entityMessage = await this.factory.buildMessage(messageDto.messageType, messageDto, user);
    if(messageDto.isPrivate) {
      const messageAndMention = await this.createPrivateMessageWithMention(entityMessage, messageDto.mentionedUserId!);
      return messageAndMention.message;
    }
    return await this.create(entityMessage);
  }

  async createIfNotExists(input: Prisma.MessageCreateInput, conversationId: string, replyTo?: string) {
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

    if (replyTo) {
      const replyMessage = await this.prisma.message.findFirst({
        where: {
          conversationId: conversationId,
          externalId: replyTo,
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

    if(!message) {
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
    return this.prisma.message.update({
      where: { id },
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

    if(!message) {
      return null;
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

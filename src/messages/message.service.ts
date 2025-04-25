import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from 'prisma/generated/prisma/client';
import { MessageFactoryService } from './message-factory.service';
import { SendMessageBaseDto } from './dto/send-message.dto';
import { SupabaseUser } from 'src/common/interfaces/supabase-user.interface';

@Injectable()
export class MessageService {
  constructor(private readonly prisma: PrismaService, private readonly factory: MessageFactoryService) { }

  async create(data: Prisma.MessageCreateInput) {
    return this.prisma.message.create({ data });
  }

  async buildAndCreate(messageDto: SendMessageBaseDto, user: SupabaseUser) {
    const message = await this.factory.buildMessage(messageDto.messageType, messageDto, user );
    return await this.create(message);
  }

  async createIfNotExists(input: Prisma.MessageCreateInput, conversationId: string) {
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

    return this.prisma.message.create({
      data: {
        ...input, conversation: {
          connect: { id: conversationId },
        }
      }
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
}

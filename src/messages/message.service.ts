import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from 'prisma/generated/prisma/client';

@Injectable()
export class MessageService {
  constructor(private readonly prisma: PrismaService) {}

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

    return this.prisma.message.create({ data: {...input, conversation: {
      connect: { id: conversationId },
    } } });
  }
  
  async updateMessageStatus(
    id: string,
    status: 'sent' | 'failed' | 'delivered' | 'read',
    extras?: Partial<Pick<Prisma.MessageUpdateInput, 'metadata'>>
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

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from 'prisma/generated/prisma/client';

@Injectable()
export class MessageService {
  constructor(private readonly prisma: PrismaService) {}

  async createMessage(data: Prisma.MessageCreateInput) {
    return this.prisma.message.create({ data });
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

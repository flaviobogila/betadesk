import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Channel, Contact } from 'prisma/generated/prisma';
import { CreateConversationLogDto } from './dto/create-conversation-log.dto';

@Injectable()
export class ConversationsLogService {
  constructor(private readonly prisma: PrismaService) { }

  findAll(conversationId: string) {
    return this.prisma.conversationLog.findFirst({
      where: {
        conversationId
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  create(dto: CreateConversationLogDto) {
    const {
      conversationId,
      type,
      from,
      to,
      performedBy,
      comment,
      metadata
    } = dto;

    return this.prisma.conversationLog.create({
      data: {
        conversationId,
        type,
        from,
        to,
        performedBy,
        comment,
        metadata
      },
    });
  }
}

import { Injectable } from '@nestjs/common';
import { CreateConversationLabelDto } from './dto/create-conversation-label.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ConversationLabelsService {
  constructor(private readonly prismaService: PrismaService) {}
  create(createConversationLabelDto: CreateConversationLabelDto) {
    const { conversationId, labelId } = createConversationLabelDto;
    return this.prismaService.conversationLabel.create({
      data: {
        conversation: { connect: { id: conversationId } },
        label: { connect: { id: labelId } },
      },
    });
  }

  findAll(conversationId: string) {
    return this.prismaService.conversationLabel.findMany({
      where: { conversationId, removedAt: null },
      include: { label: true },
      orderBy: { createdAt: 'asc' },
    });
  }

  remove(conversationId: string, labelId: string, removedById: string) {
    return this.prismaService.conversationLabel.update({
      where: { conversationId_labelId: { conversationId, labelId } },
      data: { 
        removedAt: new Date(), 
        removedBy: { connect: { id: removedById }} 
      },
    });
  }
}

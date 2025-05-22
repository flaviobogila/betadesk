import { Injectable } from '@nestjs/common';
import { CreateMessageTemplateDto } from './dto/create-message-template.dto';
import { UpdateMessageTemplateDto } from './dto/update-message-template.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MessageTemplatesService {
  constructor(private readonly prismaService: PrismaService) {

  }
  create(createMessageTemplateDto: CreateMessageTemplateDto) {
    return this.prismaService.messageTemplate.create({
      data: {
        ...createMessageTemplateDto as any,
      },
    });
  }

  findAll(channelId: string) {
    return this.prismaService.messageTemplate.findMany({
      where: {
        channelId,
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  findOne(id: string) {
    return this.prismaService.messageTemplate.findUnique({
      where: {
        id,
      },
    })
  }

  update(id: string, updateMessageTemplateDto: UpdateMessageTemplateDto) {
    
    return this.prismaService.messageTemplate.update({
      where: {
        id,
      },
      data: {
        ...updateMessageTemplateDto as any,
      },
    });
  }

  remove(id: string) {
    return this.prismaService.messageTemplate.delete({
      where: {
        id,
      },
    });
  }
}

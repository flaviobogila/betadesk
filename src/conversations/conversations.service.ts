import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Channel, Contact } from 'prisma/generated/prisma';

@Injectable()
export class ConversationsService {
  constructor(private readonly prisma: PrismaService) {}

  findOneActive(externalId: string, externalChannelId: string) {
    return this.prisma.conversation.findFirst({
      where: {
        externalId,
        externalChannelId,
        status: { in: ['open', 'in_queue', 'bot'] },
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  create(contact: Contact, channel: Channel, from: string) {
    return this.prisma.conversation.create({
      data: {
        channelId: channel.id,
        tenantId: channel.tenantId,
        contactId: contact.id,
        externalId: contact.phone!,
        externalChannelId: channel.externalId!,
        provider: 'whatsapp',
        status: 'in_queue'
      },
    });
  }

  update(id: string, data: any) {
    return this.prisma.conversation.update({
      where: { id },
      data,
    });
  }

  updateLastMessageDate(id: string, timestamp: string) {
    return this.prisma.conversation.update({
      where: { id },
      data: {
        lastMessageAt: new Date(+timestamp * 1000),
      }
    });
  }

}

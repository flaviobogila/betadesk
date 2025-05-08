import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Channel, Contact } from 'prisma/generated/prisma';

@Injectable()
export class ConversationsService {
  constructor(private readonly prisma: PrismaService) {}

  findOne(id: string) {
    return this.prisma.conversation.findFirst({
      where: {
        id
      },
      include: {
        contact: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true
          },
        },
        channel: {
          select: {
            id: true,
            name: true,
            externalId: true,
          },
        },
        tenant: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  findAll(tenantId: string) {
    return this.prisma.conversation.findFirst({
      where: {
        tenantId
      },
      orderBy: { createdAt: 'desc' }
    });
  }

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

  create(contact: Contact, channel: Channel) {
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

  assingToAgentUser(id: string, userId: string) {
    return this.prisma.conversation.update({
      where: { id},
      data: {
        assignedUserId: userId,
      }
    });
  }
}

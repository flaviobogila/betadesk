import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Channel, Contact, ConversationStatus, LogType, ParticipantRole } from 'prisma/generated/prisma';
import { HttpStatusCode } from 'axios';
import { ConversationsLogService } from './conversations-logs.service';
import { SupabaseUser } from 'src/common/interfaces/supabase-user.interface';
import { ChannelsService } from 'src/channels/channels.service';
import { ContactsService } from 'src/contacts/contacts.service';

@Injectable()
export class ConversationsService {
  constructor(
    private readonly prisma: PrismaService, 
    private readonly conversationLogService: ConversationsLogService,
    private readonly channelService: ChannelsService,
    private readonly contactService: ContactsService,
  ) { }

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
    return this.prisma.conversation.findMany({
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

  async findOneActiveOrCreateByChannelId({ channelId, clientPhone, clientName, origin }: { channelId: string, clientPhone: string, clientName: string, origin: "user" | "business" }) {
    const conversation = await this.prisma.conversation.findFirst({
      where: {
        externalId: clientPhone,
        channelId,
        status: { in: ['open', 'in_queue', 'bot'] },
      },
      orderBy: { createdAt: 'desc' }
    });
    
    if (!conversation) {
      const channel = await this.channelService.findById(channelId)
      if (!channel) {
        throw new HttpException('Canal não encontrado', HttpStatusCode.NotFound);
      }
      const contact = await this.contactService.findOrCreate(channel.tenantId, clientPhone, clientName, origin);
      return await this.create(contact, channel);
    }

    return conversation;
  }

  async findOneActiveOrCreateByExternalChannelId({ externalChannelId, clientPhone, clientName, origin }: { externalChannelId: string, clientPhone: string, clientName: string, origin: "user" | "business" }) {
    let conversation = await this.prisma.conversation.findFirst({
      where: {
        externalId: clientPhone,
        externalChannelId,
        status: { in: ['open', 'in_queue', 'bot'] },
      },
      orderBy: { createdAt: 'desc' }
    });
    
    if (!conversation) {
      const channel = await this.channelService.findByExternalId(externalChannelId)
      if (!channel) {
        throw new HttpException('Canal não encontrado', HttpStatusCode.NotFound);
      }
      const contact = await this.contactService.findOrCreate(channel.tenantId, clientPhone, clientName, origin);
      return await this.create(contact, channel);
    }

    return conversation;
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

  assignToAgentUser(id: string, userId: string, roleToAssign?: ParticipantRole, assignedBy?: SupabaseUser) {

    return this.prisma.$transaction(async (tx) => {

      const conversation = await tx.conversation.findFirst({
        where: {
          id
        }
      });

      if (conversation != null && conversation.assignedUserId == userId) {
        throw new HttpException('O agente já está vinculado a conversa', HttpStatusCode.BadRequest);
      }

      this.prisma.conversation.update({
        where: { id },
        data: {
          assignedUserId: userId,
        }
      });

      await this.conversationLogService.create({
        conversationId: id,
        type: LogType.AGENT_CHANGE,
        from: conversation?.assignedUserId || undefined,
        to: userId,
        performedBy: assignedBy!.id,
        metadata: {
          userId: assignedBy!.id,
          userName: assignedBy!.name
        }
      })

      let participant = await tx.conversationParticipant.findFirst({
        where: {
          conversationId: id,
          userId
        }
      });

      //só podemos mudar a role de sender para assignee, nunca o contrário
      if (participant) {
        if (roleToAssign == ParticipantRole.assignee) {
          participant = await tx.conversationParticipant.update({
            where: {
              conversation_participant_id: {
                conversationId: id,
                userId
              }
            },
            data: {
              role: roleToAssign,
              assignedById: assignedBy?.id
            }
          });
        }
      }
      else{
        participant = await tx.conversationParticipant.create({
          data: {
            conversationId: id,
            userId,
            assignedById: assignedBy?.id,
            role: roleToAssign
          }
        });
      }
      return { conversation, participant };
    });
  }

  async assignToTeam(id: string, teamId: string, user: SupabaseUser) {

    let conversation = await this.prisma.conversation.findUnique({
      where: { id },
      include: {
        team: true
      }
    });

    if (!conversation) {
      throw new HttpException('Conversa não encontrada', HttpStatusCode.NotFound);
    }

    if (conversation.teamId == teamId) {
      return conversation
    }

    const oldTeam = conversation?.team;

    conversation = await this.prisma.conversation.update({
      where: { id },
      data: {
        teamId,
      },
      include: {
        team: true
      }
    });

    await this.conversationLogService.create({
        conversationId: id,
        type: LogType.TEAM_CHANGE,
        from: oldTeam?.name || undefined,
        to: conversation.team?.name || undefined,
        performedBy: user.id,
        metadata: {
          userId: user.id,
          userName: user.name,
          oldTeamId: oldTeam?.id,
          newTeamId: conversation.team?.id
        }
    })

    return conversation;
  }

  async updateStatus(id: string, status: ConversationStatus, user: SupabaseUser) {

    let conversation = await this.prisma.conversation.findUnique({
      where: { id },
      select: {
        status: true
      }
    });

    if (!conversation) {
      throw new HttpException('Conversa não encontrada', HttpStatusCode.NotFound);
    }

    if (conversation.status == status) {
      return conversation
    }

    const oldStatus = conversation.status;

    conversation = await this.prisma.conversation.update({
      where: { id },
      data: {
        status,
        closedAt: status == ConversationStatus.closed ? new Date() : undefined,
      },
    });

    await this.conversationLogService.create({
      conversationId: id,
        type: LogType.STATUS_CHANGE,
        from: oldStatus,
        to: status,
        performedBy: user.id,
        metadata: {
          userId: user.id,
          userName: user.name
        }
    })

    return conversation;

  }
}

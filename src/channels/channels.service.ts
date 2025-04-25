import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChannelsService {
  constructor(private prisma: PrismaService) { }

  async createChannel(dto: CreateChannelDto, tenantId: string) {
    return this.prisma.channel.create({
      data: {
        tenantId,
        name: dto.name,
        type: dto.type,
        provider: dto.provider,
        externalId: dto.externalId,
        token: dto.token,
        metadata: dto.metadata || {},
      },
    });
  }

  async update(id: string, data: UpdateChannelDto) {
    return this.prisma.channel.update({
      where: { id },
      data,
    });
  }

  async getAllChannels(tenantId: string) {
    return this.prisma.channel.findMany({
      where: { tenantId },
    });
  }

  async getById(channelId: string) {
    const channel = await this.prisma.channel.findFirst({
      where: { id: channelId },
    });

    if (!channel) {
      throw new NotFoundException('Canal não encontrado.');
    }

    return channel;
  }

  async getByIdAndValidateTenant(channelId: string, tenantId: string) {
    const channel = await this.prisma.channel.findUnique({
      where: { id: channelId },
    });

    if (!channel) {
      throw new NotFoundException('Canal não encontrado.');
    }

    if (channel.tenantId !== tenantId) {
      throw new ForbiddenException('Você não tem permissão para acessar este canal.');
    }

    return channel;
  }

  async getAuthData(channelId: string, tenantId: string) {
    const channel = await this.getByIdAndValidateTenant(channelId, tenantId);

    if (!channel.externalId || !channel.token) {
      throw new NotFoundException('Canal está mal configurado (sem token ou phone_number_id).');
    }

    return {
      externalId: channel.externalId,
      token: channel.token,
    };
  }

  async findByExternalId(externalId: string) {
    const channel = await this.prisma.channel.findFirst({
      where: { externalId },
    });

    if (!channel) {
      throw new NotFoundException('Canal não encontrado.');
    }

    return channel;
  }
}

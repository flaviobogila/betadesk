import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TeamsService {
  constructor(private readonly prismaService: PrismaService) {}

  create(tenantId: string, name: string) {
    return this.prismaService.team.create({
      data: { name, tenantId },
    });
  }

  findAll(tenantId: string) {
    return this.prismaService.team.findMany({
      where: { tenantId},
    });
  }

  findOne(id: string) {
    return this.prismaService.team.findUnique({
      where: { id },
    });
  }

  update(id: string, name: string) {
    return this.prismaService.team.update({
      where: { id },
      data: { name },
    });
  }

  remove(id: string) {
    return this.prismaService.team.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}

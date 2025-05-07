import { Injectable } from '@nestjs/common';
import { CreateLabelDto } from './dto/create-label.dto';
import { UpdateLabelDto } from './dto/update-label.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LabelsService {
  constructor(private readonly prismaService: PrismaService) {}
  create(createLabelDto: CreateLabelDto) {
    return this.prismaService.label.create({ data: createLabelDto });
  }

  findAll(tenantId: string) {
    return this.prismaService.label.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });
  }

  findOne(id: string) {
    return this.prismaService.label.findUnique({
      where: { id },
    });
  }

  update(id: string, updateLabelDto: UpdateLabelDto) {
    return this.prismaService.label.update({
      where: { id }, 
      data: updateLabelDto,
    });
  }

  remove(id: string) {
    return this.prismaService.label.delete({
      where: { id },
    });
  }
}

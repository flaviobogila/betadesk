import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';

@Injectable()
export class TenantsService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateTenantDto) {
    return this.prisma.tenant.create({ data });
  }

  findAll() {
    return this.prisma.tenant.findMany();
  }

  findOne(id: string) {
    return this.prisma.tenant.findUnique({
      where: { id },
    });
  }

  update(id: string, data: UpdateTenantDto) {
    return this.prisma.tenant.update({
      where: { id },
      data,
    });
  }

  remove(id: string) {
    return this.prisma.tenant.delete({
      where: { id },
    });
  }
}

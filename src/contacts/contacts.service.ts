import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ContactsService {
  constructor(private prisma: PrismaService) { }

  findOrCreate(phone: string, tenantId: string, name?: string) {
    return this.prisma.contact.upsert({
      where: { phone_tenant_unique: { phone, tenantId } },
      create: { phone, tenantId, name },
      update: {},
    });
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ContactsService {
  constructor(private prisma: PrismaService) { }

  findOrCreate(tenantId: string, phone: string, name?: string, origin?: "user" | "business") {
    return this.prisma.contact.upsert({
      where: { phone_tenant_unique: { phone, tenantId } },
      create: { phone, tenantId, name, origin },
      update: {},
    });
  }
}

import { Module } from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { TenantsController } from './tenants.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [TenantsController],
  providers: [TenantsService, PrismaService],
})
export class TenantsModule {}

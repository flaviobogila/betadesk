import { Module } from '@nestjs/common';
import { MessageTemplatesService } from './message-templates.service';
import { MessageTemplatesController } from './message-templates.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MessageTemplatesController],
  providers: [MessageTemplatesService],
})
export class MessageTemplatesModule {}

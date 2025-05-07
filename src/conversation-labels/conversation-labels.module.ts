import { Module } from '@nestjs/common';
import { ConversationLabelsService } from './conversation-labels.service';
import { ConversationLabelsController } from './conversation-labels.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ConversationLabelsController],
  providers: [ConversationLabelsService],
})
export class ConversationLabelsModule {}

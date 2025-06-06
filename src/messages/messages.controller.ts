import { Controller, Post, Body, UseGuards, Param, Get, Query } from '@nestjs/common';
import { SupabaseAuthGuard } from 'src/auth/supabase-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { SupabaseUser } from 'src/common/interfaces/supabase-user.interface';
import { MessageService } from './message.service';
import { SendMessageValidationPipe } from './pipes/send-message-validation.pipe';
import { BullMQChatService } from './queues/bullmq/conversation.bullmq.service';
import { SendMessageBaseDto } from './dto/send-message.dto';

@Controller('conversations/:id')
@UseGuards(SupabaseAuthGuard)
export class MessagesController {
  constructor(private readonly messageService: MessageService, private readonly bullmqService: BullMQChatService) { }

  @Get('messages')
  findAll(@Param('id') id: string, @Query('limit') limit: number = 100) {
    return this.messageService.findAll(id, limit)
  }

  @Post('messages')
  async sendMessage(@Param('id') conversationId: string, @Body(new SendMessageValidationPipe()) body: SendMessageBaseDto, @CurrentUser() user: SupabaseUser) {

    const createMessageDto = { ...body, tenantId: user.tenantId, conversationId }
    const createdMessage = await this.messageService.save(createMessageDto, user);

    const dto = { ...createMessageDto, replyTo: createdMessage?.replyTo?.externalId ?? undefined }

    this.bullmqService.handleOutcomingWhatsappMessage(conversationId, { ...dto, messageId: createdMessage.id } as any);
    return { status: 'created', message: createdMessage };
  }
}

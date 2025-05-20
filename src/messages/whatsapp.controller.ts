import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  UseFilters,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { SupabaseAuthGuard } from 'src/auth/supabase-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { SupabaseUser } from 'src/common/interfaces/supabase-user.interface';
import { MessageService } from './message.service';
import { MessageDispatcherService } from './message-dispatcher.service';
import { SendMessageValidationPipe } from './pipes/send-message-validation.pipe';
import { MetaExceptionFilter } from 'src/common/filters/meta-exception.filter';
import { BullMQChatService } from 'src/messages/queues/bullmq/conversation.bullmq.service';

@Controller('whatsapp/messages')
@UseGuards(SupabaseAuthGuard)
export class WhatsappController {
  constructor(private readonly messageService: MessageService, private readonly bullmqService: BullMQChatService) { }

  @Post()
  @HttpCode(HttpStatus.OK)
  @UseFilters(new MetaExceptionFilter)
  async sendMessage(@Body(new SendMessageValidationPipe()) body: any, @CurrentUser() user: SupabaseUser) {

    const createMessageDto = { ...body, tenantId: user.tenantId }
    const createdMessage = await this.messageService.save(createMessageDto, user);

    const dto = { ...createMessageDto,  replyTo: createdMessage?.replyTo?.externalId ?? undefined}

    this.bullmqService.handleIncomingMessage(createdMessage.conversationId, { ...dto, messageId: createdMessage.id });
    return { status: 'created', message: createdMessage };
  }
}

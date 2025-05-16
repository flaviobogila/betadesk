import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  UseFilters,
} from '@nestjs/common';
import { SupabaseAuthGuard } from 'src/auth/supabase-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { SupabaseUser } from 'src/common/interfaces/supabase-user.interface';
import { MessageService } from './message.service';
import { MessageDispatcherService } from './message-dispatcher.service';
import { SendMessageValidationPipe } from './pipes/send-message-validation.pipe';
import { MetaExceptionFilter } from 'src/common/filters/meta-exception.filter';

@Controller('whatsapp/messages')
@UseGuards(SupabaseAuthGuard)
export class WhatsappController {
  constructor(private readonly whatsappMessageDispatcher: MessageDispatcherService, private readonly messageService: MessageService) { }

  @Post()
  @HttpCode(HttpStatus.OK)
  @UseFilters(new MetaExceptionFilter)
  async sendMessage(@Body(new SendMessageValidationPipe()) body: any, @CurrentUser() user: SupabaseUser) {

    const createMessageDto = { ...body, tenantId: user.tenantId }
    const createdMessage = await this.messageService.save(createMessageDto, user);
    
    //TODO: refatorar usando fila
    const dto = { ...createMessageDto,  replyTo: createdMessage?.replyTo?.externalId ?? undefined}
    const dispatchedMessage = await this.whatsappMessageDispatcher.dispatch(createMessageDto.messageType, dto);

    return await this.messageService.updateMessageStatus(createdMessage.id, 'sent', { externalId: dispatchedMessage?.messages[0]?.id });
  }
}

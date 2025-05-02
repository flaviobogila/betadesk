import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  UsePipes,
  UseFilters,
} from '@nestjs/common';
import { SupabaseAuthGuard } from 'src/auth/supabase-auth.guard';
import { MessageType } from './dto/message-type.enum';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { SupabaseUser } from 'src/common/interfaces/supabase-user.interface';
import { SendMessageBaseDto } from './dto/send-message.dto';
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
  async sendMessage(@Body() body: SendMessageBaseDto, @CurrentUser() user: SupabaseUser) {
    const tenantId = user.tenantId
    const messageDto = { ...body, tenantId }
    const messageType = messageDto.messageType as MessageType;
    const message = await this.messageService.buildAndCreate(messageDto, user);
    
    //TODO: refatorar usando fila
    const dispatchedMessage = await this.whatsappMessageDispatcher.dispatch(messageType, messageDto);
    const externalId = dispatchedMessage?.messages[0]?.id

    await this.messageService.updateMessageStatus(message.id, 'sent', { externalId });

    return { ...message, externalId, status: 'sent' };

  }
}

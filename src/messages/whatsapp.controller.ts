import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { SupabaseAuthGuard } from 'src/auth/supabase-auth.guard';
import { MessageFactoryService } from './message-factory.service';
import { MessageType } from './dto/message-type.enum';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { SupabaseUser } from 'src/common/interfaces/supabase-user.interface';
import { SendMessageBaseDto } from './dto/send-message.dto';
import { MessageService } from './message.service';

@Controller('whatsapp/messages')
@UseGuards(SupabaseAuthGuard)
export class WhatsappController {
  constructor(private readonly factory: MessageFactoryService, private readonly messageService: MessageService) { }

  @Post()
  @HttpCode(HttpStatus.OK)
  async sendMessage(@Body() body: SendMessageBaseDto, @CurrentUser() user: SupabaseUser) {
    const tenantId = user.tenantId
    const dto = { ...body, tenantId }

    const message = await this.factory.store(dto.messageType as MessageType, dto, user );
    const messangeSent = await this.factory.send(dto.messageType as MessageType, dto);
    await this.messageService.updateMessageStatus(message.id, 'sent', { metadata: messangeSent });

    return message;

  }
}

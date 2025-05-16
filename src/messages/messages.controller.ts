import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  Get,
  Param,
} from '@nestjs/common';
import { SupabaseAuthGuard } from 'src/auth/supabase-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { SupabaseUser } from 'src/common/interfaces/supabase-user.interface';
import { SendMessageBaseDto } from './dto/send-message.dto';
import { MessageService } from './message.service';

@Controller('conversations/:id/messages')
@UseGuards(SupabaseAuthGuard)
export class MessagesController {
  constructor(private readonly messageService: MessageService) { }

  @Get()
  findAll(@Param('id') id: string) {
    return this.messageService.findAll(id)
  }

  @Post()
  async sendMessage(@Body() body: SendMessageBaseDto, @CurrentUser() user: SupabaseUser) {
    const tenantId = user.tenantId
    const messageDto = { ...body, tenantId }

    return await this.messageService.save(messageDto, user);
  }
}

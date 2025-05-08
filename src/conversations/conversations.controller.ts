import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { TenantId } from 'src/common/decorators/tenant-id.decorator';
import { MessageService } from 'src/messages/message.service';

@Controller('conversations')
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService, private readonly messageService: MessageService) {}

  @Get()
  findAll(@TenantId() tenantId: string) {
    return this.conversationsService.findAll(tenantId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.conversationsService.findOne(id);
  }

  @Get(':id/messages')
  findAllMessages(@Param('id') id: string) {
    return this.messageService.findAll(id)
  }
}

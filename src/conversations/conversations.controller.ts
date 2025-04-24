import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
@Controller('conversations')
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}
}

import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ConversationLabelsService } from './conversation-labels.service';
import { CreateConversationLabelDto } from './dto/create-conversation-label.dto';
import { SupabaseAuthGuard } from 'src/auth/supabase-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { SupabaseUser } from 'src/common/interfaces/supabase-user.interface';

@Controller('conversations/:id/labels')
@UseGuards(SupabaseAuthGuard)
export class ConversationLabelsController {
  constructor(private readonly conversationLabelsService: ConversationLabelsService) {}

  @Post()
  create(
    @Param('id') conversationId: string, 
    @Body() createConversationLabelDto: CreateConversationLabelDto, 
    @CurrentUser() user: SupabaseUser) {
    return this.conversationLabelsService.create(
      {
        ...createConversationLabelDto, 
        conversationId, 
        createdById: user.id
      });
  }

  @Get()
  findAll(@Param('id') conversationId: string) {
    return this.conversationLabelsService.findAll(conversationId);
  }

  @Delete(':labelId')
  remove(
    @Param('id') conversationId: string, 
    @Param('labelId') labelId: string, 
    @CurrentUser() user: SupabaseUser) {
    return this.conversationLabelsService.remove(conversationId, labelId, user.id);
  }
}

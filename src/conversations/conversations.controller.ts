import { Controller, Get, Body, Param, Put, UseGuards, Patch, Delete } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { TenantId } from 'src/common/decorators/tenant-id.decorator';
import { MessageService } from 'src/messages/message.service';
import { CreateConversationAssingnedUserDto } from './dto/create-conversation-assigned-user.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { SupabaseUser } from 'src/common/interfaces/supabase-user.interface';
import { SupabaseAuthGuard } from 'src/auth/supabase-auth.guard';
import { ConversationStatus } from 'prisma/generated/prisma';
import { UpdateConversationStatusDto } from './dto/update-conversation-status.dto';

@UseGuards(SupabaseAuthGuard)
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

  @Put(':id/teams/:teamId')
  changeTeam(
    @CurrentUser() loggedUser: SupabaseUser, 
    @Param('id') id: string, 
    @Param('teamId') teamId: string) {
    return this.conversationsService.assignToTeam(id, teamId, loggedUser);
  }

  @Put(':id/users/:userId')
  changeUser(
    @CurrentUser() loggedUser: SupabaseUser, 
    @Param('id') id: string, 
    @Param('userId') userId: string, 
    @Body() assignedUserRole: CreateConversationAssingnedUserDto) {

    const { role } = assignedUserRole
    return this.conversationsService.assignToAgentUser(id, userId, role, loggedUser);
  }

  @Put(':id/status')
  changeStatus(
    @CurrentUser() loggedUser: SupabaseUser, 
    @Param('id') id: string,
    @Body() updateDto: UpdateConversationStatusDto) {
      const { status } = updateDto;
    return this.conversationsService.updateStatus(id, status, loggedUser);
  }
}

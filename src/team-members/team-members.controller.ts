import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TeamMembersService } from './team-members.service';
import { SupabaseAuthGuard } from 'src/auth/supabase-auth.guard';
import { CreateTeamMemberRoleDto } from './dto/create-team-member-role.dto';

@Controller('teams/:teamId/members')
@UseGuards(SupabaseAuthGuard)
export class TeamMembersController {
  constructor(private readonly teamMembersService: TeamMembersService) {}

  @Post()
  create(@Param('teamId') teamId: string, @Body() createTeamMemberDto: CreateTeamMemberRoleDto) {
    return this.teamMembersService.create({...createTeamMemberDto, teamId});
  }

  @Get()
  findAll(@Param('teamId') teamId: string) {
    return this.teamMembersService.findAll(teamId);
  }

  @Get(':userId')
  findOne(@Param('teamId') teamId: string, @Param('userId') userId: string) {
    return this.teamMembersService.findOne(teamId, userId);
  }

  @Patch(':userId')
  update(@Param('teamId') teamId: string, @Param('userId') userId: string, @Body() updateTeamMemberDto: CreateTeamMemberRoleDto) {
    return this.teamMembersService.update({...updateTeamMemberDto, teamId, userId});
  }

  @Delete(':userId')
  remove(@Param('teamId') teamId: string, @Param('userId') userId: string, @Body() updateTeamMemberDto: Partial<CreateTeamMemberRoleDto>) {
    return this.teamMembersService.remove({...updateTeamMemberDto, teamId, userId});
  }
}

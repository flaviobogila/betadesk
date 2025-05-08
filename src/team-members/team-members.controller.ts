import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { TeamMembersService } from './team-members.service';
import { CreateTeamMemberDto } from './dto/create-team-member.dto';
import { SupabaseAuthGuard } from 'src/auth/supabase-auth.guard';

@Controller('members')
@UseGuards(SupabaseAuthGuard)
export class TeamMembersController {
  constructor(private readonly teamMembersService: TeamMembersService) {}

  @Post()
  create(@Body() createTeamMemberDto: CreateTeamMemberDto) {
    return this.teamMembersService.create(createTeamMemberDto);
  }

  @Get()
  findAll(@Query('teamId') teamId: string) {
    return this.teamMembersService.findAll(teamId);
  }

  @Patch()
  update(@Body() updateTeamMemberDto: CreateTeamMemberDto) {
    return this.teamMembersService.update(updateTeamMemberDto);
  }

  @Delete()
  remove(@Body() updateTeamMemberDto: Partial<CreateTeamMemberDto>) {
    return this.teamMembersService.remove(updateTeamMemberDto);
  }
}

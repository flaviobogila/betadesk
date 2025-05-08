import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { SupabaseAuthGuard } from 'src/auth/supabase-auth.guard';
import { TenantId } from 'src/common/decorators/tenant-id.decorator';

@Controller('teams')
@UseGuards(SupabaseAuthGuard)
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post()
  create(@TenantId() tenantId: string, @Body() createTeamDto: CreateTeamDto) {
    const { name } = createTeamDto;
    return this.teamsService.create(tenantId, name);
  }

  @Get()
  findAll(@TenantId() tenantId: string) {
    return this.teamsService.findAll(tenantId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teamsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTeamDto: UpdateTeamDto) {
    const { name } = updateTeamDto;
    return this.teamsService.update(id, name!);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.teamsService.remove(id);
  }
}

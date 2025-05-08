import { Injectable } from '@nestjs/common';
import { CreateTeamMemberDto } from './dto/create-team-member.dto';
import { UpdateTeamMemberDto } from './dto/update-team-member.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { TeamRole } from 'prisma/generated/prisma';

@Injectable()
export class TeamMembersService {
  constructor(private readonly prismaService: PrismaService){}

  create(createTeamMemberDto: CreateTeamMemberDto) {
    return this.prismaService.teamMember.create({
      data: createTeamMemberDto,
    });
  }

  findAll(teamId: string) {
    return this.prismaService.teamMember.findMany({
      where: { teamId },
      include: {
        user: true,
      },
    });
  }

  update(updateTeamDto: CreateTeamMemberDto) {
    const { teamId, userId, role } = updateTeamDto;
    return this.prismaService.teamMember.update({
      where: { user_team_id: { teamId, userId } },
      data: { role },
    });
  }

  remove(updateTeamDto: Partial<CreateTeamMemberDto>) {
    return this.prismaService.teamMember.delete({
      where: { user_team_id: { teamId: updateTeamDto.teamId!, userId: updateTeamDto.userId! } },
    });
  }
}

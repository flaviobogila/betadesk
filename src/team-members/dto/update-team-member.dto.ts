import { PartialType } from '@nestjs/swagger';
import { CreateTeamMemberRoleDto } from './create-team-member-role.dto';

export class UpdateTeamMemberDto extends PartialType(CreateTeamMemberRoleDto) {}

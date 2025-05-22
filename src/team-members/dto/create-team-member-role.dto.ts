import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsOptional, IsUUID } from "class-validator";
import { TeamRole } from "prisma/generated/prisma";

export class CreateTeamMemberRoleDto {
    @ApiProperty({ example: 'uuid' })
    @IsUUID(undefined, { message: 'O id do time deve ser válido' })
    @IsNotEmpty({ message: 'O nome do time não pode estar vazio.' })
    @IsOptional()
    userId: string;

    @ApiProperty({ description: 'Papel do usuário no time', example: 'member' })
    @IsEnum(TeamRole, { message: 'O papel do membro deve ser um dos seguintes: member, admin' })
    role: TeamRole;
}

import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsUUID } from "class-validator";
import { TeamRole } from "prisma/generated/prisma";

export class CreateTeamMemberDto {
    @ApiProperty({ example: 'uuid' })
    @IsUUID(undefined, { message: 'O id do time deve ser válido' })
    @IsNotEmpty({ message: 'O nome do time não pode estar vazio.' })
    teamId: string;

    @ApiProperty({ example: 'uuid' })
    @IsUUID(undefined, { message: 'O id do time deve ser válido' })
    @IsNotEmpty({ message: 'O nome do time não pode estar vazio.' })
    userId: string;

    @ApiProperty({ example: 'member' })
    @IsEnum(TeamRole, { message: 'O papel do membro deve ser um dos seguintes: member, admin' })
    role: TeamRole;
}

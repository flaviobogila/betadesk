import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsOptional, IsUUID } from "class-validator";
import { ParticipantRole } from "prisma/generated/prisma";

export class CreateConversationAssingnedUserDto {
    @ApiProperty({example: '123e4567-e89b-12d3-a456-426614174000'})
    @IsUUID()
    @IsNotEmpty({message: 'Id do usuário é obrigatório'})
    @IsOptional()
    assignedById?: string;

    @ApiProperty({example: 'assignee'})
    @IsOptional()
    @IsEnum(ParticipantRole, {message: 'O papel deve ser assignee ou sender'})
    role?: ParticipantRole
}

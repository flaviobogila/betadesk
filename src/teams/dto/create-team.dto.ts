import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateTeamDto {
    @ApiProperty({ example: 'atendimento' })
    @IsString({ message: 'O nome do time deve ser uma string.' })
    @IsNotEmpty({ message: 'O nome do time não pode estar vazio.' })
    name: string;
}



import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsUUID } from "class-validator";

export class CreateConversationLabelDto {
    @ApiProperty({example: '123e4567-e89b-12d3-a456-426614174000'})
    @IsUUID()
    @IsNotEmpty({message: 'LabelId é obrigatório'})
    labelId: string;
}

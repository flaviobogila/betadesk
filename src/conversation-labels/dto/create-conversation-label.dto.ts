import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsUUID } from "class-validator";

export class CreateConversationLabelDto {
    @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
    @IsUUID()
    @IsNotEmpty({ message: 'conversationId não pode estar vazio' })
    @IsOptional()
    conversationId?: string;

    @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
    @IsUUID()
    @IsNotEmpty({ message: 'LabelId não pode estar vazio' })
    labelId: string;

    @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
    @IsUUID()
    @IsNotEmpty({ message: 'createdById não pode estar vazio' })
    createdById?: string;
}

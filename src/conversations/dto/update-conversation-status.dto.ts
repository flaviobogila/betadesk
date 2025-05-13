import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";
import { ConversationStatus } from "prisma/generated/prisma";

export class UpdateConversationStatusDto {
    @ApiProperty({example: 'open'})
    @IsEnum(ConversationStatus, {message: 'O status deve ser open, in_queue, closed ou bot'})
    status: ConversationStatus;
}

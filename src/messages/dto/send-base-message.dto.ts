
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, IsNotEmpty, IsUUID } from 'class-validator';

export class SendBaseMessageDto {
    @ApiProperty()
    @IsUUID()
    channelId: string;

    @ApiProperty()
    @IsUUID()
    conversationId: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    to: string;
}



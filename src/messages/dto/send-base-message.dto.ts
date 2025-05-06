
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsUUID, IsOptional } from 'class-validator';

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

    @ApiProperty()
    @IsString()
    @IsUUID()
    @IsOptional()
    replyTo: string;

}



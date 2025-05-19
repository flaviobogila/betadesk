
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsUUID, IsOptional, IsEnum } from 'class-validator';
import { MessageType } from 'prisma/generated/prisma';

export class SendBaseMessageDto {
    @ApiProperty({ description: 'Id do canal', example: 'e6106c10-00aa-4230-8b9d-23ea24267bd3' })
    @IsUUID()
    channelId: string;

    @ApiProperty({ description: 'Id do conversa', example: 'e6106c10-00aa-4230-8b9d-23ea24267bd3' })
    @IsUUID()
    conversationId: string;

    @ApiProperty({ description: 'Número de Whatsapp do destinatário ', example: '5515997013863' })
    @IsString()
    @IsNotEmpty()
    to: string;

    @ApiProperty({ description: 'Tipo da mensagem', example: 'text, image, etc...' })
    @IsEnum(MessageType)
    messageType: MessageType;

    @ApiProperty({ description: 'Id da mensagem a ser respondida', example: 'e6106c10-00aa-4230-8b9d-23ea24267bd3' })
    @IsString()
    @IsUUID()
    @IsOptional()
    replyTo: string;

    @ApiProperty({ description: 'Id da mensagem', example: 'e6106c10-00aa-4230-8b9d-23ea24267bd3' })
    @IsUUID()
    @IsOptional()
    messageId?: string;
}



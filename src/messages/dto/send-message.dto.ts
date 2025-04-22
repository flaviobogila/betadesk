// src/messages/dto/send-message-base.dto.ts
import { IsUUID, IsEnum, IsNotEmpty, IsOptional, ValidateIf, IsString, IsUrl } from 'class-validator';
import { MessageType } from './message-type.enum';
import { ApiProperty } from '@nestjs/swagger';

export class SendMessageBaseDto {
  @ApiProperty({ example: 'uuid-do-canal' })
  @IsUUID(undefined, { message: 'channelId precisa ser um UUID válido.' })
  channelId: string;

  @ApiProperty({ example: 'uuid-da-conversa' })
  @IsNotEmpty({ message: 'conversationId não pode estar vazio.' })
  @IsUUID(undefined, { message: 'conversationId precisa ser um UUID válido.' })
  conversationId: string;

  @ApiProperty({ enum: MessageType })
  @IsEnum(MessageType, { message: 'messageType deve ser um tipo válido (text, image, template, etc).' })
  messageType: MessageType;

  @ApiProperty()
  @IsNotEmpty({ message: 'to não pode estar vazio.' })
  to: string;

  @ApiProperty({example: 'oi, tudo bem?'})
  @ValidateIf((o) => o.messageType === MessageType.text)
  @IsNotEmpty({ message: 'O campo content não pode estar vazio para mensagens de texto.' })
  content?: string;

  @ApiProperty({example: 'https://example.com/image.jpg'})
  @ValidateIf((o) => [MessageType.image, MessageType.video, MessageType.audio, MessageType.document].includes(o.messageType))
  @IsNotEmpty({ message: 'O campo mediaUrl é obrigatório para mensagens de mídia.' })
  @IsUrl({}, { message: 'mediaUrl deve ser uma URL válida.' })
  mediaUrl?: string;

  @ApiProperty({example: 'essa é uma imagem de exemplo'})
  @ValidateIf((o) => o.messageType === MessageType.image)
  @IsString({ message: 'caption deve ser uma string.' })
  @IsOptional()
  caption?: string;
}


import { IsEnum, IsNotEmpty, IsString, IsOptional, IsUUID } from 'class-validator';
import { MessageType } from './message-type.enum';

export class SendMessageDto {
  @IsUUID()
  channelId: string;

  @IsString()
  to: string; // número de telefone do destinatário (ex: 5511999999999)

  @IsEnum(MessageType)
  messageType: MessageType;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsOptional()
  @IsString()
  caption?: string;

  @IsOptional()
  @IsString()
  mediaUrl?: string;
}

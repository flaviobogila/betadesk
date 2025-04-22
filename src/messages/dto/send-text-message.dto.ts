import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class SendTextMessageDto {
  @IsUUID()
  channelId: string;

  @IsUUID()
  conversationId: string;

  @IsString()
  @IsNotEmpty()
  to: string; // número internacional (ex: 5511999999999)

  @IsString()
  @IsNotEmpty()
  content: string;
}

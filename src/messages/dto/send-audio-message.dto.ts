import { IsString, IsOptional, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SendBaseMessageDto } from './send-base-message.dto';
import { MessageType } from 'prisma/generated/prisma';

export class SendAudioMessageDto extends SendBaseMessageDto {

  @ApiProperty()
  @IsString()
  messageType: MessageType;

  @ApiProperty()
  @IsString()
  audioUrl: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  mimeType?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  duration?: number;
}
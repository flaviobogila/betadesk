import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SendBaseMessageDto } from './send-base-message.dto';

export class SendStickerMessageDto extends SendBaseMessageDto {

  @ApiProperty()
  @IsString()
  stickerUrl: string;

  @ApiProperty()
  @IsString()
  mimeType: string;
}

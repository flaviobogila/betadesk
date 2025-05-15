import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SendBaseMessageDto } from './send-base-message.dto';

export class SendStickerMessageDto extends SendBaseMessageDto {

  @ApiProperty({ description: 'URL do sticker', example: 'https://example.com/sticker.webp' })
  @IsString()
  stickerUrl: string;

  @ApiProperty({ description: 'Mime-Type do arquivo', example: 'image/webp' })
  @IsString()
  @IsOptional()
  mimeType: string;
}

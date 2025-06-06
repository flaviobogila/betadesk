import { IsString, IsOptional, IsInt, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SendBaseMessageDto } from './send-base-message.dto';

export class SendAudioMessageDto extends SendBaseMessageDto {

  @ApiProperty({ description: 'Audio URL', example: 'https://example.com/audio.mp3' })
  @IsString()
  @IsUrl(undefined, { message: 'A Url deve ser válida' })
  audioUrl: string;

  @ApiProperty({ description: 'O Mime-Type que descreve o tipo de conteúdo do arquivo', example: 'audio/ogg', required: false })
  @IsOptional()
  @IsString()
  mimeType?: string;

  @ApiProperty({ description: 'Duração do áudio em milisegundos', example: 30, required: false })
  @IsOptional()
  @IsInt()
  duration?: number;
}
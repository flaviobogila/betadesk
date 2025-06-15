import { IsString, IsOptional, IsInt, IsUrl, IsArray } from 'class-validator';
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

  @ApiProperty({ description: 'Tamanho do arquivo em bytes', example: 30000, required: false })
  @IsOptional()
  @IsInt()
  size?: number;

  @ApiProperty({ description: 'Array de frequencia do audio', example: [0.15, 4.0], required: false })
  @IsOptional()
  @IsArray({ message: 'waveBars deve ser uma lista de números que representa as ondas sonoradas do áudio' })
  waveBars?: number[];
}